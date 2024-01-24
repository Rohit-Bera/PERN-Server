const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const serverPort = process.env.PORT;

app.get("/", (request, response) => {
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
