const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./models/db");
const authRouter = require("./routes/authRouter");

const app = express();



connectDB();


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "UniStay API running on Vercel",
  });
});

const apiRoutes = require('./routes');

app.use("/auth", authRouter);
app.use("/api", apiRoutes);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on port ${process.env.PORT || 8080}`);
});

module.exports = app;
