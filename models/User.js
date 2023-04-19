const db = require("../db");
const { v4: uuid } = require("uuid");
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
class User {
  static async getLoggedIn(body) {
    const { username, password } = body;
    if (!username || !password) {
      throw new ExpressError("Must enter a username and password", 400);
    }

    const getPassword = await db.query(
      `SELECT password from users WHERE username =$1`,
      [username.toLowerCase()]
    );
    if (getPassword.rows[0]) {
      const passwordCorrect = await bcrypt.compare(
        password,
        getPassword.rows[0].password
      );
      if (passwordCorrect) {
        const result = await this.getUser(username);
        const token = jwt.sign(result, PLAID_SECRET_KEY, {
          expiresIn: "2w",
        });
        return token;
      } else {
        throw new ExpressError(
          "The username and password combination you have entered do not match any of our records. Please try again",
          400
        );
      }
    } else {
      throw new ExpressError("User does not exist", 404);
    }
  }
  // static async refreshUserToken(body) {
  //   const username = jwt.decode(body.token).username;
  //   const password = body.password;
  //   const newUsername = body.new_username;
  //   const getPassword = await db.query(
  //     `SELECT password from users WHERE username =$1`,
  //     [username.toLowerCase()]
  //   );
  //   if (getPassword) {
  //     const passwordCorrect = await bcrypt.compare(
  //       password,
  //       getPassword.rows[0].password
  //     );
  //     if (passwordCorrect) {
  //       const result = await db.query(
  //         `UPDATE users
  //                       SET username=$1
  //                       where username=$2
  //                       RETURNING username, id AS user_id, first_name`,
  //         [newUsername, username]
  //       );
  //       const token = jwt.sign(result.rows[0], PLAID_SECRET_KEY, {
  //         expiresIn: "2w",
  //       });
  //       return token;
  //     } else {
  //       throw new ExpressError("Incorrect Password", 400);
  //     }
  //   } else {
  //     throw new ExpressError("User does not exist", 404);
  //   }
  // }

  static async create(email) {
    const newUser = await db.query(
      `INSERT INTO users (email)
       VALUES ($1) RETURNING id, email`,
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
