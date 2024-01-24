// todolist=> create table users(id serial primary key, username text , email text , password text);
// CREATE TABLE
// todolist=> create table tasks(id serial primary key, date text,task text , userid int , foreign key(userid) references users(id) );
// CREATE TABLE
require("dotenv").config();

const { Pool } = require("pg");

const user = process.env.USER;
const db = process.env.DATABASE;
const pass = process.env.PG_PASSWORD;
const host = process.env.PG_HOST;
const port = process.env.PG_PORT;

// database connection
const pool = new Pool({
  host: host,
  user: user,
  database: db,
  password: pass,
  port: port,
});

//user
const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    console.log("password: ", password);
    console.log("email: ", email);

    await pool.query(
      "CREATE TABLE IF NOT EXISTS users (id serial primary key, username text , email text , password text)"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS tasks(id serial primary key, date text,task text , userid int , foreign key(userid) references users(id) )"
    );

    const result = await pool.query(
      "select * from users where email=$1 and password=$2",
      [email, password]
    );
    console.log("result: ", result);

    result.rowCount === 1
      ? response
          .status(200)
          .json({ message: "Login Successfull!", rows: result.rows[0] })
      : response.status(200).json({ message: "user not found!" });
  } catch (err) {
    console.log("error: ", err);
    response.status(500).json({ message: "something went wrong!", error: err });
  }
};

const signup = async (request, response) => {
  try {
    try {
      const { username, email, password } = request.body;

      const result = await pool.query(
        "insert into users(username , email , password ) values($1 , $2 , $3) returning *",
        [username, email, password]
      );
      console.log("result: ", result);

      result
        ? response
            .status(200)
            .json({ message: "Signup Successfull!", rows: result.rows[0] })
        : response.status(400).json({ message: "something went wrong!" });
    } catch (err) {
      console.log("err: ", err);
      response
        .status(500)
        .json({ message: "something went wrong!", error: err });
    }
  } catch (err) {
    console.log("error: ", err);
    response.status(500).json({ message: "something went wrong!", error: err });
  }
};

const getList = async (request, response) => {
  try {
    const id = request.params.id;
    const result = await pool.query("select * from tasks where userid = $1", [
      id,
    ]);

    const records = result.rows;

    records
      ? response.status(200).json({ rows: records })
      : response.status(404).json({ error: "records not found" });
  } catch (err) {
    console.log("error: ", err);
    response.status(500).json({ message: "something went wrong!", error: err });
  }
};

const postList = async (request, response) => {
  try {
    const { date, task } = request.body;
    const id = request.params.id;
    // const date = "08-01-2024";
    // const task = "something";

    const result = await pool.query(
      "insert into tasks(date , task , userid ) values($1 , $2 , $3) returning *",
      [date, task, id]
    );
    console.log("result: ", result);

    result &&
      response.status(200).json({ message: "record added successfully!" });
  } catch (err) {
    console.log("err: ", err);
    response.status(500).json({ message: "something went wrong!", error: err });
  }
};

const putList = async (request, response) => {
  try {
    const { date, task } = request.body;

    const id = request.params.id;

    const result = await pool.query(
      "update tasks set date = $1 , task = $2 where id = $3 returning *",
      [date, task, id]
    );

    result &&
      response.status(200).json({ message: "record updated successfully!" });
  } catch (err) {
    console.log("err: ", err);
    response.status(500).json({ message: "something went wrong!", error: err });
  }
};

const deleteList = async (request, response) => {
  try {
    const id = request.params.id;

    const result = pool.query("delete from tasks where id = $1", [id]);

    (result &&
      response.status(200).json({ message: "record deleted successfully!" })) ||
      response.status(400).json({ message: "record not deleted!" });
  } catch (err) {
    console.log("err: ", err);
    response.status(500).json({ message: "something went wrong!", error: err });
  }
};

module.exports = {
  getList,
  postList,
  putList,
  deleteList,
  login,
  signup,
};
