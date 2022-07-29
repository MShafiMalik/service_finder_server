const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");
const serviceRoutes = require("./serviceRoutes");
const bookingRoutes = require("./bookingRoutes");
const buyerReviewRoutes = require("./buyerReviewRoutes");
const messagesRoutes = require("./messagesRoutes");

module.exports = (app) => {
  app.use("/api/auth/", authRoutes);
  app.use("/api/category/", categoryRoutes);
  app.use("/api/service/", serviceRoutes);
  app.use("/api/booking/", bookingRoutes);
  app.use("/api/buyer-review/", buyerReviewRoutes);
  app.use("/api/message/", messagesRoutes);
};
