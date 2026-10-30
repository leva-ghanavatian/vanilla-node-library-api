const rentModel = require("../models/Rent");
const rentService = require("../services/rentService");
const Rent = require("../src/resources/rent");
const { parsePagination } = require("../src/parsing/pagination");

const getAllRents = async (req, res) => {
    const { page, limit, sort, ...filterQuery } = req.query;

    const filter = Rent.parseFilter(filterQuery);
    const sortObj = Rent.parseSort(sort);
    const { skip, limit: parsedLimit } = parsePagination({ page, limit });

    const rents = await rentModel.find({
        filter,
        sort: sortObj,
        skip,
        limit: parsedLimit
    });

    res.json(rents);
};

const rentBook = async (req, res) => {
    const { userId, bookId } = Rent.parseCreate(req.body);
    const rent = await rentService.rentBook(userId, bookId);
    res.status(201).json(rent);
};

const returnBook = async (req, res) => {
    const { bookId } = Rent.parseOnly(req.query, ["bookId"]);
    const rent = await rentService.returnBook(bookId);
    res.json(rent);
};

module.exports = { getAllRents, rentBook, returnBook };