require("dotenv").config();
const express = require("express");
const { requireJsonBody, notFound, errorHandler } = require("./middlewares/http");

const bookCont = require("./controllers/bookCont");
const userCont = require("./controllers/userCont");
const rentCont = require("./controllers/rentCont");

const bookModel = require("./models/Book");
const userModel = require("./models/User");
const rentModel = require("./models/Rent");

const byId = (single, list) => {
    return (req, res, next) => {

        if (req.query.id !== undefined) {
            return single(req, res, next);
        } else {
            return list(req, res, next);
        }

    };
};

const api = express.Router();

api.get("/books",           byId(bookCont.getBook, bookCont.getAllBooks));
api.post("/books",          requireJsonBody, bookCont.createBook);
api.patch("/books",         requireJsonBody, bookCont.updateBook);
api.delete("/books",        bookCont.deleteBook);

api.get("/users",           byId(userCont.getUser, userCont.getAllUsers));
api.post("/users",          requireJsonBody, userCont.registerUser);
api.post("/users/login",    requireJsonBody, userCont.loginUser);
api.put("/users/upgrade",   userCont.upgradeUser);
api.put("/users",           requireJsonBody, userCont.updateCrime);

api.get("/rents",           rentCont.getAllRents);
api.post("/rents",          rentCont.rentBook);
api.put("/rents/return",    rentCont.returnBook);

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use("/api", api);
app.use(notFound);
app.use(errorHandler); // always last

// Indexes must exist before the first request is served
const start = async () => {
    await Promise.all([bookModel.init(), userModel.init(), rentModel.init()]);
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
};

start().catch(error => {
    console.error("Startup failed:", error);
    process.exit(1);
});