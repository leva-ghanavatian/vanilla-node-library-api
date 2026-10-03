const userModel = require("../models/User");
const userInput = require("../validators/user");
const { signToken } = require("../helpers/auth");
const { sendJson, readJsonBody, getRequiredParam, getPagination, handleError } = require("../helpers/utils");
const { NotFoundError, UnauthorizedError } = require("../helpers/errors");

const getAllUsers = async (req, res) => {
    try {
        sendJson(res, 200, await userModel.find(getPagination(req)));
    } catch (error) {
        handleError(res, error);
    }
};

const getUser = async (req, res) => {
    try {
        const user = await userModel.findById(getRequiredParam(req, "id"));
        if (!user) throw new NotFoundError("User not found");
        sendJson(res, 200, user);
    } catch (error) {
        handleError(res, error);
    }
};

const registerUser = async (req, res) => {
    try {
        const input = userInput.parseRegistration(await readJsonBody(req));
        sendJson(res, 201, await userModel.create(input));
    } catch (error) {
        handleError(res, error);
    }
};

const upgradeUser = async (req, res) => {
    try {
        const user = await userModel.setRole(getRequiredParam(req, "id"), userModel.ROLES.ADMIN);
        if (!user) throw new NotFoundError("User not found");
        sendJson(res, 200, user);
    } catch (error) {
        handleError(res, error);
    }
};

const updateCrime = async (req, res) => {
    try {
        const id = getRequiredParam(req, "id");
        const { crime } = userInput.parseCrime(await readJsonBody(req));
        const user = await userModel.setCrime(id, crime);
        if (!user) throw new NotFoundError("User not found");
        sendJson(res, 200, user);
    } catch (error) {
        handleError(res, error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = userInput.parseLogin(await readJsonBody(req));
        const user = await userModel.authenticate(email, password);
        if (!user) throw new UnauthorizedError("Invalid email or password");
        sendJson(res, 200, { token: signToken(user) });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getAllUsers,
    getUser,
    registerUser,
    upgradeUser,
    updateCrime,
    loginUser
};