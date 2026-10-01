const bookModel = require("../models/Book");
const userModel = require("../models/User");
const rentModel = require("../models/Rent");
const { NotFoundError } = require("../helpers/errors");

const rentBook = async (userId, bookId) => {
    const user = await userModel.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const book = await bookModel.markRented(bookId);
    if (!book) throw new NotFoundError("Book not found");

    try {
        return await rentModel.create({ userId: user._id, bookId: book._id });
    } catch (error) {
        await bookModel.markReturned(book._id)
            .catch(rollbackError => console.error("Rollback failed:", rollbackError));
        throw error;
    }
};

const returnBook = async bookId => {
    const book = await bookModel.markReturned(bookId);
    if (!book) throw new NotFoundError("Book not found");

    const rent = await rentModel.close(book._id);
    return { book, rent };
};

module.exports = { rentBook, returnBook };