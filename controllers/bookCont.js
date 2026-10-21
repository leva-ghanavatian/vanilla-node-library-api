const bookModel = require("../models/Book");
const bookInput = require("../validators/book");
const { parseBookFilter, parseBookSort } = require("../validators/bookFilter");
const { parsePagination } = require("../validators/pagination");
const { parseId } = require("../validators/id");

const getAllBooks = async (req, res) => {
    const { page, limit, sort, ...rest } = req.query;
    res.json(await bookModel.find({
        filter: parseBookFilter(rest),
        sort: parseBookSort(sort),
        ...parsePagination({ page, limit }),
    }));
};

const getBook = async (req, res) => {
    res.json(found(await bookModel.findById(parseId(req.params.id)), "Book"));
};

const createBook = async (req, res) => {
    res.status(201).json(await bookModel.create(bookInput.parseCreate(req.body)));
};

const updateBook = async (req, res) => {
    const id = parseId(req.params.id);
    res.json(found(await bookModel.update(id, bookInput.parseUpdate(req.body)), "Book"));
};

const deleteBook = async (req, res) => {
    res.json(found(await bookModel.remove(parseId(req.params.id)), "Book"));
};

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
};