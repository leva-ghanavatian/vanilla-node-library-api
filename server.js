require("dotenv").config();
const express = require("express");
const { notFound, errorHandler } = require("./middlewares/http");
const { initModels } = require("./models");
const api = require("./routes");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use("/api", api);
app.use(notFound);
app.use(errorHandler); // always last

// Indexes must exist before the first request is served
const start = async () => {
    await initModels();
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
};

start().catch(error => {
    console.error("Startup failed:", error);
    process.exit(1);
});