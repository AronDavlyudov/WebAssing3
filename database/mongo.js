const { MongoClient } = require("mongodb");
require('dotenv').config();

const URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = "assignment3";

let db;

async function connectDB() {
    if (db) return db;
    const client = new MongoClient(URL);
    await client.connect();
    db = client.db(DB_NAME);
    console.log("MongoDB connected");
    return db;
}

module.exports = connectDB;