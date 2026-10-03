const bookModel = require("../models/Book");
const bookInput = require("../validators/book");
const pageInput = require("../validators/pagination");
const idInput = require("../validators/id");
const { NotFoundError } = require("../helpers/errors");
const { sendJson, readJsonBody, getRequiredParam, getQuery, handleError } = require("../helpers/utils");

const getAllBooks = async (req, res) => {
    try {
        sendJson(res, 200, await bookModel.find(pageInput.parseFilter(getQuery(req))));
    } catch (error) {
        handleError(res, error);
    }
};

const getBook = async (req, res) => {
    try {
        const book = await bookModel.findById(idInput.parseId(getRequiredParam(req, "id")));
        if (!book) throw new NotFoundError("Book not found");
        sendJson(res, 200, book);
    } catch (error) {
        handleError(res, error);
    }
};

const createBook = async (req, res) => {
    try {
        const input = bookInput.parseCreate(await readJsonBody(req));
        sendJson(res, 201, await bookModel.create(input));
    } catch (error) {
        handleError(res, error);
    }
};

const updateBook = async (req, res) => {
    try {
        const id = idInput.parseId(getRequiredParam(req, "id"));
        const changes = bookInput.parseUpdate(await readJsonBody(req));
        const book = await bookModel.update(id, changes);
        if (!book) throw new NotFoundError("Book not found");
        sendJson(res, 200, book);
    } catch (error) {
        handleError(res, error);
    }
};

const deleteBook = async (req, res) => {
    try {
        const deleted = await bookModel.remove(idInput.parseId(getRequiredParam(req, "id")));
        if (!deleted) throw new NotFoundError("Book not found");
        sendJson(res, 200, deleted);
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
};