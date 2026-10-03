const { ObjectId } = require("mongodb");
const { ValidationError } = require("./errors");

const toObjectId = id => {
    if (!/^[0-9a-f]{24}$/i.test(String(id))) throw new ValidationError("Invalid id");
    return new ObjectId(id);
};

module.exports = { toObjectId };