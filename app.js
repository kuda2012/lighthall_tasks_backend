const express = require("express");
const cors = require("cors");
const app = express();
const { DB_URI } = require("./config");
const { db } = require("./db");
const ExpressError = require("./expressError");
app.use(cors());
app.use(express.json());

const {
  signupOrLogin,
  getAllTasks,
  createOrSaveTask,
  getTask,
  deleteTasks,
} = require("./controllers/controller");

app.post("/signup", signupOrLogin);
app.post("/tasks/save", createOrSaveTask);
app.get("/tasks", getAllTasks);
app.get("/tasks/:task_id", getTask);
app.delete("/tasks/delete", deleteTasks);
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/** Generic error handler. */

app.use(function (err, req, res, next) {
  if (err.stack) console.error(err.stack);
  return res.status(err.status || 500).send({
    message: err.message,
    err,
  });
});

module.exports = { app };
