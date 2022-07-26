const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");
const serviceRoutes = require("./serviceRoutes");

module.exports = (app) => {
  app.use("/api/auth/", authRoutes);
  app.use("/api/category/", categoryRoutes);
  app.use("/api/service/", serviceRoutes);
};
