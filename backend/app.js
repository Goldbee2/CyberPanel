var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

// Routers
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var weatherRouter = require("./routes/weather");
var lightsRouter = require("./routes/lights");
var oauth2Router = require("./routes/oauth2");
const { getSystemErrorMap } = require("util");

var app = express();


// CORS options

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());

// Sessions


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Setting globals
// app.set("example", exampleModule.exampleData());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/weather", weatherRouter);
app.use("/lights", lightsRouter);

app.use("/oauth2", oauth2Router);

app.use("/favicon.ico", express.static("public/images/favicon_server.ico"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render((title = "error"));
});

module.exports = app;
