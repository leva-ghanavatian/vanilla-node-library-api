const rentModel = require("../models/Rent");
const rentService = require("../services/rentService");
const { parseRentFilter, parseRentSort, parseRentIds, parseBookId
} = require("../validators/rent");
const { parsePagination } = require("../validators/pagination");

const getAllRents = async (req, res) => {
    const { page, limit, sort, ...rest } = req.query;
    res.json(await rentModel.find({
        filter: parseRentFilter(rest),
        sort: parseRentSort(sort),
        ...parsePagination({ page, limit }),
    }));
};

const rentBook = async (req, res) => {
    const { userId, bookId } = parseRentIds(req.body);
    res.status(201).json(await rentService.rentBook(userId, bookId));
};

const returnBook = async (req, res) => {
    const { bookId } = parseBookId(req.query);
    res.json(await rentService.returnBook(bookId));
};

module.exports = { getAllRents, rentBook, returnBook };