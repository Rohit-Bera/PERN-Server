const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const serverPort = process.env.PORT;

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
const setupDB = async (request, response, next) => {
  try {
    const usersTable = await pool.query("select * from users");
    const tasksTable = await pool.query("select * from tasks");
  } catch (error) {
    console.log("DB not found!: ", error);
    const createUser = await pool.query(
      "create table users(id serial primary key, username text , email text , password text)"
    );
    const createTask = await pool.query(
      "create table tasks(id serial primary key, task text , userid int , foreign key(userid) references users(id) )"
    );
  }
};

app.get("/", (request, response) => {
  setupDB();
  response
    .status(200)
    .json({ message: `Server is running! on port : ${serverPort}` });
});

const {
  getList,
  postList,
  putList,
  deleteList,
  login,
  signup,
} = require("./apis/app");

//users
app.post("/login", login); //login user to the database
app.post("/signup", signup); //add user to the database

//tasks
app.get("/getList/:id", getList); // get user list
app.post("/postList/:id", postList); // post user list
app.put("/putList/:id", putList); // updtae user list
app.delete("/deleteList/:id", deleteList); // delete user list

const server = http.createServer(app);

server.listen(serverPort, () => {
  console.log(`server is running on port ${serverPort}`);
});
