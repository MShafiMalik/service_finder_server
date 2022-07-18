const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database/db_connection/connect_db");
const { DB_URL, SERVER_PORT } = require("./config/keys");
const authRoutes = require("./routes/authRoutes");
const webRoutes = require("./routes/webRoutes");

app.use(bodyParser.urlencoded({ extended: false }));

// JSON Setup
app.use(bodyParser.json());

// Setup Cors
app.use(cors());

// DB Connection
connectDB(DB_URL);

// Setting Routes
app.use("/", webRoutes);
app.use("/api/", authRoutes);

app.listen(SERVER_PORT, () => {
  console.log(`App is listerning at http://localhost:${SERVER_PORT}`);
});
