require("dotenv").config();

const http = require("http");
const { getParam, sendError } = require("./helpers/utils");

const bookCont = require("./controllers/bookCont");
const userCont = require("./controllers/userCont");
const rentCont = require("./controllers/rentCont");

const bookModel = require("./models/Book");
const userModel = require("./models/User");
const rentModel = require("./models/Rent");

const hasId = req => getParam(req, "id") !== null;

const routes = {
    "GET /api/books":         (req, res) => (hasId(req) ? bookCont.getBook : bookCont.getAllBooks)(req, res),
    "POST /api/books":        bookCont.createBook,
    "PATCH /api/books":       bookCont.updateBook,
    "DELETE /api/books":      bookCont.deleteBook,

    "GET /api/users":         (req, res) => (hasId(req) ? userCont.getUser : userCont.getAllUsers)(req, res),
    "POST /api/users":        userCont.registerUser,
    "POST /api/users/login":  userCont.loginUser,
    "PUT /api/users/upgrade": userCont.upgradeUser,
    "PUT /api/users":         userCont.updateCrime,

    "GET /api/rents":         rentCont.getAllRents,
    "POST /api/rents":        rentCont.rentBook,   
    "PUT /api/rents/return":  rentCont.returnBook
};

const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, "http://localhost");
    const handler = routes[`${req.method} ${pathname.replace(/\/+$/, "")}`];

    if (handler) return handler(req, res);
    sendError(res, 404, "Route not found");
});

// Indexes must exist before the first request is served
const start = async () => {
    await Promise.all([bookModel.init(), userModel.init(), rentModel.init()]);
    server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
};

start().catch(error => {
    console.error("Startup failed:", error);
    process.exit(1);
});