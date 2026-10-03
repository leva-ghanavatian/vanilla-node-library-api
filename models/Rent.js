const DB = require("../configs/db");
const { toObjectId } = require("../helpers/ids");
const { ConflictError } = require("../helpers/errors");

const getCollection = async () => (await DB.getDb()).collection("rents");

// Call once at startup, before the server starts listening.
const init = async () => {
    const rents = await getCollection();
    await rents.createIndexes([
        // At most ONE active rent per book, enforced by the database itself.
        // Returned rents (active: false) are ignored, so history is unlimited.
        {
            key: { bookId: 1 },
            name: "unique_active_rent_per_book",
            unique: true,
            partialFilterExpression: { active: true }
        },
        // Fast "rents of this user, newest first"
        { key: { userId: 1, rentedAt: -1 }, name: "rents_by_user" }
    ]);
};

// Optional filters: userId, bookId, active (true = not yet returned)
const find = async ({ page = 1, limit = 20, userId, bookId, active } = {}) => {
    const rents = await getCollection();

    const filter = {};
    if (userId) filter.userId = toObjectId(userId);
    if (bookId) filter.bookId = toObjectId(bookId);
    if (active !== undefined) filter.active = active;

    return rents
        .find(filter)
        .sort({ rentedAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
};

const create = async ({ userId, bookId }) => {
    const rents = await getCollection();
    const rent = {
        userId: toObjectId(userId),
        bookId: toObjectId(bookId),
        active: true,
        rentedAt: new Date()
    };

    try {
        const { insertedId } = await rents.insertOne(rent);
        return { ...rent, _id: insertedId };
    } catch (error) {
        if (error.code === 11000) throw new ConflictError("The book is already rented.");
        throw error;
    }
};

// Closes the active rent of a book and returns it. Returns null when the book
// has no active rent record ( rents created before this schema existed);
const close = async bookId => {
    const rents = await getCollection();
    return rents.findOneAndUpdate(
        { bookId: toObjectId(bookId), active: true },
        { $set: { active: false, returnedAt: new Date() } },
        { returnDocument: "after" }
    );
};

module.exports = { init, find, create, close };