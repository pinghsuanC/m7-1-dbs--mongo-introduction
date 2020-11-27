const fs = require("file-system");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async () => {
  //console.log(greetings[0]);
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("exercise_2");
    // add an data
    const result = await db.collection("greetings").insertMany(greetings);
    assert.strictEqual(greetings.length, result.insertedCount); // equal depreciated
    //res.status(201).json({ status: 201, data: greetings, "success" });
    console.log("success");
    client.close();
  } catch (err) {
    console.log(err);
    /*res
      .status(500)
      .json({ status: 500, data: greetings, message: err.message });*/
    console.log("failed");
    client.close();
  }
};

batchImport();
