const DB = require("../configs/db");
const { ConflictError } = require("../helpers/errors");
const bcrypt = require("bcrypt");

const ROLES = Object.freeze({ USER: "USER", ADMIN: "ADMIN" });
const HIDE_HASH = { projection: { passwordHash: 0 } };
const CASE_INSENSITIVE = { locale: "en", strength: 2 };

const DUPLICATE_MESSAGES = {
    username: "Username already taken.",
    email: "Email already registered."
};

const getCollection = async () => (await DB.getDb()).collection("users");

// Turns a Mongo duplicate-key error into a 409 that names the field
const rethrowDuplicate = error => {
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern ?? {})[0];
        throw new ConflictError(DUPLICATE_MESSAGES[field] ?? "Username or email already taken.");
    }
    throw error;
};

const init = async () => {
    const users = await getCollection();
    await users.createIndexes([
        { key: { username: 1 }, name: "unique_username", unique: true, collation: CASE_INSENSITIVE },
        { key: { email: 1 }, name: "unique_email", unique: true, collation: CASE_INSENSITIVE }
    ]);
};

const find = async ({ page = 1, limit = 20 } = {}) => {
    const users = await getCollection();
    return users
        .find({}, HIDE_HASH)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
};

// Returns null when not found
const findById = async _id => {
    const users = await getCollection();
    return users.findOne({ _id }, HIDE_HASH);
};

// Returns the user (without passwordHash) when the credentials match, else null.
// The hash never leaves this file.
const authenticate = async (email, password) => {
    const users = await getCollection();
    const user = await users.findOne({ email }, { collation: CASE_INSENSITIVE });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null;

    const { passwordHash, ...safe } = user;
    return safe;
};

// Expects already-validated input (see validators/user.js).
const create = async ({ name, username, email, password }) => {
    const users = await getCollection();
    const user = {
        name,
        username,
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role: ROLES.USER,
        crime: 0,
        createdAt: new Date()
    };
    try {
        const { insertedId } = await users.insertOne(user);
        const { passwordHash, ...safe } = user;
        return { ...safe, _id: insertedId };
    } catch (error) {
        rethrowDuplicate(error);
    }
};

const modify = async (_id, fields) => {
    const users = await getCollection();
    return users.findOneAndUpdate(
        { _id },
        { $set: { ...fields, updatedAt: new Date() } },
        { returnDocument: "after", ...HIDE_HASH }
    );
};

const setRole = (id, role) => {
    if (!Object.values(ROLES).includes(role)) {
        throw new Error(`Invalid role: ${role}`);
    }
    return modify(id, { role });
};

const setCrime = (id, crime) => modify(id, { crime });

module.exports = {
    ROLES,
    init,
    find,
    findById,
    authenticate,
    create,
    setRole,
    setCrime
};