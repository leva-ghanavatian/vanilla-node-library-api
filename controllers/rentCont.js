const rentModel = require("../models/Rent");
const rentService = require("../services/rentService");
const rentInput = require("../validators/rent");
const {
    sendJson, getRequiredParam, getQuery, handleError
} = require("../helpers/utils");

const getAllRents = async (req, res) => {
    try {
        const rents = await rentModel.find(rentInput.parseFilters(getQuery(req)));
        sendJson(res, 200, rents);
    } catch (error) {
        handleError(res, error);
    }
};

const rentBook = async (req, res) => {
    try {
        const { userId, bookId } = rentInput.parseRentIds({
            userId: getRequiredParam(req, "userId"),
            bookId: getRequiredParam(req, "bookId")
        });
        sendJson(res, 201, await rentService.rentBook(userId, bookId));
    } catch (error) {
        handleError(res, error);
    }
};

const returnBook = async (req, res) => {
    try {
        const { bookId } = rentInput.parseBookId({ bookId: getRequiredParam(req, "bookId") });
        sendJson(res, 200, await rentService.returnBook(bookId));
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { getAllRents, rentBook, returnBook };