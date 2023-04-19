require("dotenv").config();
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV === "test") {
  DB_URI = "tasks_database_test";
} else {
  DB_URI = process.env.DATABASE_URL || "tasks_database";
}

module.exports = {
  PORT,
  DB_URI,
};
