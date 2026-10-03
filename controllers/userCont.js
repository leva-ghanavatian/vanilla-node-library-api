const userModel = require("../models/User");
const userInput = require("../validators/user");
const pageInput = require("../validators/pagination");
const idInput = require("../validators/id");
const { signToken } = require("../helpers/auth");
const { NotFoundError, UnauthorizedError } = require("../helpers/errors");

const getAllUsers = async (req, res) => {
    res.json(await userModel.find(pageInput.parseFilter(req.query)));
};

const getUser = async (req, res) => {
    const user = await userModel.findById(idInput.parseId(req.query.id));
    if (!user) throw new NotFoundError("User not found");
    res.json(user);
};

const registerUser = async (req, res) => {
    res.status(201).json(await userModel.create(userInput.parseRegistration(req.body)));
};

const upgradeUser = async (req, res) => {
    const user = await userModel.setRole(idInput.parseId(req.query.id), userModel.ROLES.ADMIN);
    if (!user) throw new NotFoundError("User not found");
    res.json(user);
};

const updateCrime = async (req, res) => {
    const id = idInput.parseId(req.query.id);
    const { crime } = userInput.parseCrime(req.body);
    const user = await userModel.setCrime(id, crime);
    if (!user) throw new NotFoundError("User not found");
    res.json(user);
};

const loginUser = async (req, res) => {
    const { email, password } = userInput.parseLogin(req.body);
    const user = await userModel.authenticate(email, password);
    if (!user) throw new UnauthorizedError("Invalid email or password");
    res.json({ token: signToken(user) });
};

module.exports = {
    getAllUsers,
    getUser,
    registerUser,
    upgradeUser,
    updateCrime,
    loginUser
};