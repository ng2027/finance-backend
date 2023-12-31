require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const requireAuth = require("./middleware/requireAuth");
const app = express();
const PORT = process.env.PORT || 5000;

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const transactionRoutes = require("./routes/transaction");
const categoryRoutes = require("./routes/category");
const subscriptionRoutes = require("./routes/subscription");
const tabRoutes = require("./routes/tab");
const reportRoutes = require("./routes/report");

//middle ware
app.use(express.json());
app.use(cors());
// Logger middleware
const logger = (req, res, next) => {
  console.log(`Requested Path: ${req.path} | Method: ${req.method}`);
  next();
};

// Use the logger middleware for all routes
app.use(logger);
//routes
app.get("/", (req, res) => {
  res.json({ msg: "Welcome to the app" });
});

app.use("/user", userRoutes);

app.use("/admin", adminRoutes);

app.use(requireAuth);

app.use("/report", reportRoutes);

app.use("/transaction", transactionRoutes);

app.use("/category", categoryRoutes);

app.use("/subscription", subscriptionRoutes);

app.use("/tab", tabRoutes);

app.use((req, res, next) => {
  res.status(404).send({ error: "404 - Not Found" });
});
// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Listen for requests
    app.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
