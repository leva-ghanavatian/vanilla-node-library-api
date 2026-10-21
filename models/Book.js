const DB = require("../configs/db");
const { ConflictError } = require("../helpers/errors");

const CASE_INSENSITIVE = { locale: "en", strength: 2 };
const getCollection = async () => (await DB.getDb()).collection("books");

await books.createIndex(
    { title: 1, author: 1 },
    { unique: true, name: "unique_title_author", collation: CASE_INSENSITIVE }
);

// Turns a Mongo duplicate-key error into a meaningful 409
const rethrowDuplicate = error => {
    if (error.code === 11000) {
        throw new ConflictError("A book with the same title and author already exists.");
    }
    throw error;
};

const conflictOrNull = async (books, _id, message) => {
    if (await books.countDocuments({ _id }, { limit: 1 })) throw new ConflictError(message);
    return null;
};

// Call once at startup, before the server starts listening.
// Fails if duplicate title+author pairs already exist in the collection.
const init = async () => {
    const books = await getCollection();
    await books.createIndex(
        { title: 1, author: 1 },
        {
            unique: true,
            name: "unique_title_author",
            collation: { locale: "en", strength: 2 } // case-insensitive
        }
    );
};

const find = async ({ filter, sort, skip, limit }) => {
    const books = await getCollection();
    return books
        .find(filter, { collation: CASE_INSENSITIVE })
        .sort({ ...sort, _id: -1 })   // _id keeps pages stable when sort values tie
        .skip(skip)
        .limit(limit)
        .toArray();
};

const findById = async _id => {
    const books = await getCollection();
    return books.findOne({ _id });
};

// Expects already-validated input (see validators/book.js).
const create = async ({ title, author, price }) => {
    const books = await getCollection();
    const book = { title, author, price, free: 1, createdAt: new Date() };

    try {
        const { insertedId } = await books.insertOne(book);
        return { ...book, _id: insertedId };
    } catch (error) {
        rethrowDuplicate(error);
    }
};

// Expects already-validated, non-empty changes.
// Returns the full updated book, or null when not found.
const update = async (_id, changes) => {
    const books = await getCollection();
    try {
        return await books.findOneAndUpdate(
            { _id },
            { $set: { ...changes, updatedAt: new Date() } },
            { returnDocument: "after" }
        );
    } catch (error) {
        rethrowDuplicate(error);
    }
};

// Returns the deleted book, null when not found,
// throws ConflictError when the book exists but is rented.
const remove = async _id => {
    const books = await getCollection();
    const deleted = await books.findOneAndDelete({ _id, free: 1 });
    return deleted ?? conflictOrNull(books, _id, "Book is currently rented and cannot be deleted");
};

// Atomic state change: succeeds only if the book is currently in the `from`
// state, so two concurrent requests can never both win.
// Returns the updated book, or null when it doesn't exist or is not in `from`.
const transition = async (_id, from, to, conflictMessage) => {
    const books = await getCollection();
    const book = await books.findOneAndUpdate(
        { _id, free: from },
        { $set: { free: to, updatedAt: new Date() } },
        { returnDocument: "after" }
    );
    return book ?? conflictOrNull(books, _id, conflictMessage);
    //if (book) return book;                                  // the update worked
    //return conflictOrNull(books, _id, conflictMessage);     // it didn't: find out why
};

const markRented = id => transition(id, 1, 0, "The book is already rented.");
const markReturned = id => transition(id, 0, 1, "The book is not currently rented.");

module.exports = {
    init,
    find,
    findById,
    create,
    update,
    remove,
    markRented,
    markReturned
};