const rentModel = require("../models/Rent");
const rentService = require("../services/rentService");
const rentFilters = require("../validators/rent");
const {
    sendJson, getRequiredParam, getQuery, getPagination, handleError
} = require("../helpers/utils");

const getAllRents = async (req, res) => {
    try {
        const rents = await rentModel.find({
            ...getPagination(req),
            ...rentFilters.parseFilters(getQuery(req))
        });
        sendJson(res, 200, rents);
    } catch (error) {
        handleError(res, error);
    }
};

const rentBook = async (req, res) => {
    try {
        const userId = getRequiredParam(req, "userId");
        const bookId = getRequiredParam(req, "bookId");
        sendJson(res, 201, await rentService.rentBook(userId, bookId));
    } catch (error) {
        handleError(res, error);
    }
};

const returnBook = async (req, res) => {
    try {
        const bookId = getRequiredParam(req, "bookId");
        sendJson(res, 200, await rentService.returnBook(bookId));
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { getAllRents, rentBook, returnBook };