const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getCollection = async (dbName) => {
  // get client by uri
  const client = await MongoClient(MONGO_URI, options);

  // connection
  await client.connect(); // connect to client
  const db = client.db(dbName); // connect to database

  console.log("connected!");

  // fetch data from database
  const users = await db.collection("users").find().toArray();

  console.log(users);

  client.close();
  console.log("disconnected!");
  return;
};

getCollection("exercise_1");
