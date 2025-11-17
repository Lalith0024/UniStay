const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./models/db");
const authRouter = require("./routes/authRouter");
const productRouter = require("./routes/productroute");

const app = express();

// Connect DB once
(async function () {
  await connectDB();
})();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "UniStay API running on Vercel",
  });
});

app.use("/auth", authRouter);
app.use("/products", productRouter);

module.exports = app;
