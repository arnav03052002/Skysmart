const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;

const userRouter=require("./src/controllers/user.controller");

const connect = require("./src/configs/db");

app.use(cors());
app.use(express.json());

app.use("/user",userRouter)


app.listen(port, async () => {
  try {
    await connect();
    console.log(`Database connected successfully and server listening on http://localhost:8080`);
  } catch (error) {
    console.log(error.message);
  }
});
