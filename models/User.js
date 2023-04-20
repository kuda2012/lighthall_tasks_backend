const db = require("../db");
const { v4: uuid } = require("uuid");
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
class User {

  static async create(email) {
    const newUser = await db.query(
      `INSERT INTO users (email)
       VALUES ($1) RETURNING id as user_id, email`,
      [email]
    );
    return newUser.rows[0];
  }
  static async getUser(email) {
    const getUser = await db.query(
      `SELECT id AS user_id, email FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    return getUser.rows[0];
  }
}

module.exports = User;
