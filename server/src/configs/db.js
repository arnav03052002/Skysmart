// const mongoose = require("mongoose");
// require("dotenv").config();

// let connect = () => {
//   return mongoose.connect("mongodb://127.0.0.1:27017/newbus");
// };

// module.exports= connect;

const mongoose = require("mongoose");

module.exports = () => {
  return mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/smartsky");
};


