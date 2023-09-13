const express = require("express");
const connectFlash = require("connect-flash");
const createError = require("http-errors");
const session = require("express-session");
const logger = require("morgan");
const path = require("path");
const ejs = require("ejs");
require("dotenv").config();

const ShortUrl = require("./models/url.model");

// connecting to mongodb
require("./config/init-mongodb");

const app = express();

// static folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine setup
app.set("view engine", "ejs");

// Init session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secret: true,
      httpOnly: true,
    },
  })
);

// flash messages
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  next();
});

// routes
app.use("/", require("./routes/index.route"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError.NotFound());
});

// Error Handler
app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.render("index", { error: err });
});

const port = process.env.PORT || 3000;
app.listen(
  port,
  console.log(`server is listening on "http://localhost:${port}"`)
);
