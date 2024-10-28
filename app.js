const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo");
const authRoutes = require("./routes/auth");
const calculateRoutes = require("./routes/calculate");
const { initializePassport } = require("./config");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.yoczwia.mongodb.net/ordercal?retryWrites=true&w=majority`,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public")); // Serve static files

// Routes
app.use("/", authRoutes);
app.use("/", calculateRoutes);

// Connect to MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.yoczwia.mongodb.net/ordercal?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to MongoDB Successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
