require("dotenv").config();
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { notFound, errorHandler, camelcase } = require("./middlewares/http");
const { initModels } = require("./models");
const api = require("./routes");

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "1mb" }));
app.use(camelcase)

app.use("/api", api);
app.use(notFound);

app.use(errorHandler);

// Indexes must exist before the first request is served
const start = async () => {
    await initModels();
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
};

start().catch(error => {
    console.error("Startup failed:", error);
    process.exit(1);
});