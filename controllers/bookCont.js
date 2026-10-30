const bookModel = require("../models/Book");
const Book = require("../src/resources/book");
const { parsePagination } = require("../src/parsing/pagination");
const { parseId } = require("../src/parsing/id");
const found = require("../helpers/found");

const getAllBooks = async (req, res) => {
    const { page, limit, sort, ...filterQuery } = req.query;

    const filter = Book.parseFilter(filterQuery);
    const sortObj = Book.parseSort(sort);
    const { skip, limit: parsedLimit } = parsePagination({ page, limit });

    const books = await bookModel.find({
        filter,
        sort: sortObj,
        skip,
        limit: parsedLimit
    });

    res.json(books);
};

const getBook = async (req, res) => {
    const id = parseId(req.params.id);
    const book = await bookModel.findById(id);
    if (!found) {
        return res.status(404).json({ error: "Book not found" });
    }
    res.json(found(book, "Book"));
};

const createBook = async (req, res) => {
    const data = Book.parseCreate(req.body);
    const newBook = await bookModel.create(data);
    res.status(201).json(newBook);
};

const updateBook = async (req, res) => {
    const id = parseId(req.params.id);
    const data = Book.parseUpdate(req.body);
    const updatedBook = await bookModel.update(id, data);
    res.json(found(updatedBook, "Book"));
};

const deleteBook = async (req, res) => {
    const id = parseId(req.params.id);
    const deletedBook = await bookModel.remove(id);
    res.json(found(deletedBook, "Book"));
};

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
};