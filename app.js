const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database/db_connection/connect_db");
const { DB_URL, PORT } = require("./config/keys");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

app.use(bodyParser.urlencoded({ extended: false }));

// JSON Setup
app.use(bodyParser.json());

// Setup Cors
app.use(cors());

// DB Connection
connectDB(DB_URL);

// Setting Routes
app.use("/api/auth/", authRoutes);
app.use("/api/category/", categoryRoutes);
app.use("/api/service/", serviceRoutes);

app.listen(PORT, () => {
  console.log(`App is listerning at http://localhost:${PORT}`);
});
