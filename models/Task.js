const db = require("../db");
const {
  statusTranslatorWordToNumber,
  statusTranslatorNumberToWord,
} = require("../helpers/statusTranslators");
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
      orderString = orderString.concat("status");
    }
    orderString = orderString.replace(/,\s*$/, "");
    if (!orderString) {
      orderString = "title";
    }
    const getTasks = await db.query(
      `SELECT id, title, to_char(due_date, 'mm-dd-yyyy') as due_date, description, status FROM tasks WHERE user_id=$1
      ORDER BY ${orderString}`,
      [user_id]
    );
    for (let task of getTasks.rows) {
      task.status = statusTranslatorNumberToWord(task.status);
    }
    return getTasks.rows;
  }
  static async getTask(task_id) {
    const getTask = await db.query(
      `SELECT id, title, to_char(due_date, 'mm-dd-yyyy') as due_date, status, description FROM tasks WHERE id=$1`,
      [task_id]
    );
    return getTask.rows[0]
      ? {
          ...getTask.rows[0],
          status: statusTranslatorNumberToWord(getTask.rows[0]?.status),
        }
      : {};
  }
  static async create(body) {
    let { user_id, title, description, status, due_date } = body;
    status = statusTranslatorWordToNumber(status);
    const createTask = await db.query(
      `INSERT INTO tasks (user_id, title, description, status, due_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING id as task_id, user_id, title, description, status, due_date`,
      [user_id, title, description, status, due_date]
    );
    return createTask.rows[0];
  }
  static async update(body) {
    let { title, description, status, due_date, task_id } = body;
    status = statusTranslatorWordToNumber(status);
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
