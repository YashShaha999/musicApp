const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);

module.exports = app;
