const rentModel = require("../models/Rent");
const rentService = require("../services/rentService");
const rentInput = require("../validators/rent");

const getAllRents = async (req, res) => {
    res.json(await rentModel.find(rentInput.parseFilters(req.query)));
};

const rentBook = async (req, res) => {
    const { userId, bookId } = rentInput.parseRentIds(req.query);
    res.status(201).json(await rentService.rentBook(userId, bookId));
};

const returnBook = async (req, res) => {
    const { bookId } = rentInput.parseBookId(req.query);
    res.json(await rentService.returnBook(bookId));
};

module.exports = { getAllRents, rentBook, returnBook };