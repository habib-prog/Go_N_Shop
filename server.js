const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const router = require("./src/routes/index");
const DataBase = require("./src/config/database");

const app = express();
app.use(express.json());
app.use(router);

const Port = process.env.port;

const RunApp = async () => {
  try {
    await DataBase();
    app.listen(Port, () => {
      console.log(`🌐 Server Running on Port: ${Port}`);
    });
  } catch (error) {
    console.error(`App failed to run ${error.message}`);
  }
};

RunApp();
