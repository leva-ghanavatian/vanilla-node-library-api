const bookModel = require("../models/Book");
const bookInput = require("../validators/book");
const pageInput = require("../validators/pagination");
const idInput = require("../validators/id");
const { NotFoundError } = require("../helpers/errors");

const getAllBooks = async (req, res) => {
    sendJson(res, 200, await bookModel.find(pageInput.parseFilter(req.query)));   
};

const getBook = async (req, res) => {
    const book = await bookModel.findById(idInput.parseId(req.query.id));
    if (!book) throw new NotFoundError("Book not found");
    res.json(book);
};

const createBook = async (req, res) => {
    res.status(201).json(await bookModel.create(bookInput.parseCreate(req.body)));
};

const updateBook = async (req, res) => {
    const id = idInput.parseId(req.query.id);
    const book = await bookModel.update(id, bookInput.parseUpdate(req.body));
    if (!book) throw new NotFoundError("Book not found");
    res.json(book);
};

const deleteBook = async (req, res) => {
    const deleted = await bookModel.remove(idInput.parseId(req.query.id));
    if (!deleted) throw new NotFoundError("Book not found");
    res.json(deleted);
};

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
};