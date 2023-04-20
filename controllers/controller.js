let User = require("../models/User");
let Task = require("../models/Task");

const signupOrLogin = async (req, res, next) => {
  try {
    let user = await User.getUser(req.body.email);
    if (user) {
      res.json({ user });
    } else if (req.body.confirm_signup) {
      user = await User.create(req.body.email);
      res.json({ user });
    } else {
      res.json({
        message:
          "This user does not exist, would you like to create an account with this email?",
      });
    }
  } catch (error) {
    if (error.code === "23505") {
      error.status = 409;
      error.message =
        "This username is already taken. Please try a different one.";
    }
    next(error);
  }
};

const createOrSaveTask = async (req, res, next) => {
  try {
    let data;
    if (req.body.task_id) {
      data = await Task.update(req.body);
      res.json({ message: "Your task was updated", data });
    } else {
      data = await Task.create(req.body);
      res.json({ message: "Your task was created", data });
    }
  } catch (error) {
    next(error);
  }
};
const getAllTasks = async (req, res, next) => {
  try {
    let data = await Task.getAllTasks(req.body);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
const getTask = async (req, res, next) => {
  try {
    let data = await Task.getTask(req.params.task_id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
const deleteTasks = async (req, res, next) => {
  try {
    let data = await Task.deleteTasks(req.body);
    res.json({ message: "Your task(s) have been deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signupOrLogin,
  createOrSaveTask,
  getAllTasks,
  getTask,
  deleteTasks,
};
