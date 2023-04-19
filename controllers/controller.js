let User = require("../models/User");
let Task = require("../models/Task");

const signupOrLogin = async (req, res, next) => {
  try {
    let user = await User.getUser(req.body.email);
    if (user) {
      res.json({ user });
    } else {
      user = await User.create(req.body.email);
      res.json({ user });
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
    } else {
      data = await Task.create(req.body);
    }
    res.json(data);
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

module.exports = { signupOrLogin, createOrSaveTask, getAllTasks, getTask };
