const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  // get client with uri
  const client = await MongoClient(MONGO_URI, options);

  // connect client and database
  await client.connect(); // connect to client
  const db = client.db("exercise_1"); // connect to database

  // connect to the database
  console.log("connected!");

  // add data to database
  await db.collection("users").insertOne(req.body);
  res.status(201).json({ status: 201, message: "Successfully insert!" });

  // close connection
  client.close();
  return;
};

module.exports = { addUser };
