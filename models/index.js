const bookModel = require("./Book");
const userModel = require("./User");
const rentModel = require("./Rent");

const initModels = () => Promise.all([bookModel.init(), userModel.init(), rentModel.init()]);

module.exports = { initModels };