const db = require("../db");
const { v4: uuid } = require("uuid");
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
class Task {
  static async getAllTasks(query) {
    const { user_id, title, due_date, status } = query;
    let orderString = "";
    if (title) {
      orderString = orderString.concat("title, ");
    }
    if (due_date) {
      orderString = orderString.concat("due_date, ");
    }
    if (status) {
      orderString = orderString.concat("status asc");
    }
    orderString = orderString.replace(/,\s*$/, "");
    if (!orderString) {
      orderString = "title";
    }
    const getTasks = await db.query(
      `SELECT id, title, due_date, status FROM tasks WHERE user_id=$1
      ORDER BY ${orderString}`,
      [user_id]
    );
    return getTasks.rows;
  }
  static async getTask(task_id) {
    const getTasks = await db.query(
      `SELECT id, title, due_date, status, description FROM tasks WHERE id=$1`,
      [task_id]
    );
    return getTasks.rows[0];
  }
  static async create(body) {
    const { user_id, title, description, status, due_date } = body;
    const createTask = await db.query(
      `INSERT INTO tasks (user_id, title, description, status, due_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING id as task_id, user_id, title, description, status, due_date`,
      [user_id, title, description, status, due_date]
    );
    return createTask.rows[0];
  }
  static async update(body) {
    const { title, description, status, due_date, task_id } = body;
    const updateTask = await db.query(
      `UPDATE tasks 
         SET title=$2, 
         description=$3,
         status=$4,
         due_date=$5
       WHERE id =$1 RETURNING id as task_id, user_id, title, description, status, due_date`,
      [task_id, title, description, status, due_date]
    );
    return updateTask.rows[0];
  }
  static async deleteTasks(body) {
    const { task_ids } = body;
    for (let task_id of task_ids) {
      await db.query(
        `DELETE FROM tasks
      WHERE id =$1`,
        [task_id]
      );
    }
    return "Job is done";
  }
}

module.exports = Task;
