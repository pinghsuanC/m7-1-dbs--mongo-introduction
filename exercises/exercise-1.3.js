const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {
  // get client by uri
  const client = await MongoClient(MONGO_URI, options);

  // connection
  await client.connect(); // connect to client
  const db = client.db("exercise_1"); // connect to database

  console.log("connected!");

  // fetch data from database
  const users = await db.collection("users").find().toArray();

  if (users.length === 0) {
    res
      .status(404)
      .json({ status: 404, data: users, message: "Nothing found!" });
  } else {
    res.status(200).json({ status: 200, data: users, message: "Users Found!" });
  }

  // close connection
  client.close();
  return;
};

module.exports = { getUsers };
