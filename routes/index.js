const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");
const serviceRoutes = require("./serviceRoutes");
const bookingRoutes = require("./bookingRoutes");

module.exports = (app) => {
  app.use("/api/auth/", authRoutes);
  app.use("/api/category/", categoryRoutes);
  app.use("/api/service/", serviceRoutes);
  app.use("/api/booking/", bookingRoutes);
};
