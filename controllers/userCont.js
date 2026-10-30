const userModel = require("../models/User");
const User = require("../src/resources/user");
const { parsePagination } = require("../src/parsing/pagination");
const { parseId } = require("../src/parsing/id");
const { signToken } = require("../helpers/auth");
const { UnauthorizedError } = require("../helpers/errors");
const found = require("../helpers/found");


const getAllUsers = async (req, res) => {
    const { page, limit, sort, ...filterQuery } = req.query;

    const filter = User.parseFilter(filterQuery);
    const sortObj = User.parseSort(sort);
    const { skip, limit: parsedLimit } = parsePagination({ page, limit });

    const users = await userModel.find({
        filter,
        sort: sortObj,
        skip,
        limit: parsedLimit
    });

    res.json(users);
};

const getUser = async (req, res) => {
    const id = parseId(req.params.id);
    const user = await userModel.findById(id);
    res.json(found(user, "User"));
};

const getMe = async (req, res) => {
    const id = parseId(req.user.sub);
    const user = await userModel.findById(id);
    res.json(found(user, "User"));
};

const registerUser = async (req, res) => {
    const data = User.parseOnly(req.body, ["name", "username", "email", "password"]);
    const newUser = await userModel.create(data);
    res.status(201).json(newUser);
};

const upgradeUser = async (req, res) => {
    const id = parseId(req.params.id);
    const user = await userModel.setRole(id, userModel.ROLES.ADMIN);
    res.json(found(user, "User"));
};

const updateCrime = async (req, res) => {
    const id = parseId(req.params.id);
    const { crime } = User.parseOnly(req.body, ["crime"]);
    const user = await userModel.setCrime(id, crime);
    res.json(found(user, "User"));
};

const loginUser = async (req, res) => {
    const { email, password } = User.parseOnly(req.body, ["email", "password"]);
    const user = await userModel.authenticate(email, password);
    if (!user) throw new UnauthorizedError("Invalid email or password");
    res.json({ token: signToken(user) });
};

const deleteUser = async (req, res) => {
    const id = parseId(req.params.id);
    const user = await userModel.deleteUser(id);
    res.json(found(user, "User"));
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