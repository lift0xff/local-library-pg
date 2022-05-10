const dotenv = require("dotenv");
dotenv.config();
// var mongoose = require("mongoose");
// var mongoDB = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/local_library';
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
const postgres = require("postgres");
const sql = postgres(process.env.POSTGRES_URI, {
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = sql;
