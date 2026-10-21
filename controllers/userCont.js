const userModel = require("../models/User");
const userInput = require("../validators/user");
const { parseUserFilter, parseUserSort } = require("../validators/userFilter");
const { parsePagination } = require("../validators/pagination");
const { parseId } = require("../validators/id");
const { signToken } = require("../helpers/auth");
const { UnauthorizedError } = require("../helpers/errors");
const found = require("../helpers/found");

const getAllUsers = async (req, res) => {
    const { page, limit, sort, ...rest } = req.query;
    res.json(await userModel.find({
        filter: parseUserFilter(rest),
        sort: parseUserSort(sort),
        ...parsePagination({ page, limit }),   // page, limit, skip
    }));
};

const getUser = async (req, res) => {
    res.json(found(await userModel.findById(parseId(req.params.id))), "User");
};

const getMe = async (req, res) => {
    res.json(found(await userModel.findById(parseId(req.user.sub))), "User");
};

const registerUser = async (req, res) => {
    res.status(201).json(await userModel.create(userInput.parseRegistration(req.body)));
};

const upgradeUser = async (req, res) => {
    res.json(found(await userModel.setRole(parseId(req.params.id), userModel.ROLES.ADMIN)), "User");
};

const updateCrime = async (req, res) => {
    const id = parseId(req.params.id);
    const { crime } = userInput.parseCrime(req.body);
    res.json(found(await userModel.setCrime(id, crime)), "User");
};

const loginUser = async (req, res) => {
    const { email, password } = userInput.parseLogin(req.body);
    const user = await userModel.authenticate(email, password);
    if (!user) throw new UnauthorizedError("Invalid email or password");
    res.json({ token: signToken(user) });
};

const deleteUser = async (req, res) => {
    res.json(found(await userModel.deleteUser(parseId(req.params.id))), "User");
};

module.exports = {
    getAllUsers,
    getUser,
    registerUser,
    getMe,
    upgradeUser,
    updateCrime,
    loginUser,
    deleteUser
};