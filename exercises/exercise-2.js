const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("exercise_2");
    // add an data
    const result = await db.collection("greetings").insertOne(req.body);
    assert.strictEqual(1, result.insertedCount); // equal depreciated
    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
};

const getGreeting = async (req, res) => {
  let _id = req.params._id;
  if (!_id || _id === "") {
    res
      .status(400)
      .json({ status: 400, message: "You haven't provided an id." });
    return;
  }
  // switch case
  _id = () => {
    switch (_id.toLowerCase()) {
      case "cambodian":
        return "KM"; // can add other language cases here, but I am lazy.
      default:
        // anther way I can think of is to send find by lang, it would be the same thing but replace _id with "const varFind" where it could be _id or lang
        return _id;
    }
  };

  //console.log(_id);
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_2");
  // add an data
  await db.collection("greetings").findOne({ _id }, (err, result) => {
    if (err) {
      res.status(404).json({ status: 404, message: "ERROR" });
      client.close();
      return;
    } else {
      result
        ? res.status(201).json({ status: 201, data: result })
        : res.status(404).json({
            status: 404,
            message: `No greeting with id ${_id} found!`,
          });
      client.close();
    }
  });
};

const getGreetings = async (req, res) => {
  let { start, limit } = req.query;
  start = parseInt(start);
  limit = parseInt(limit);

  if (start == null || limit == null || isNaN(start) || isNaN(limit)) {
    res.status(400).json({
      status: 400,
      result: [],
      message: "The parameters are not provided or illegal.",
    });
    return;
  }

  // start connecting
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_2");
  const result = await db.collection("greetings").find().toArray();
  if (start >= result.length) {
    res.status(400).json({
      status: 400,
      result: [],
      message: "Illegal Arguments!",
    });
  }

  const result_slice = result.slice(start, start + limit); // slice method won't error for out-boundary
  //console.log(result_slice.length);
  if (start + limit > result.length) {
    res.status(200).json({
      status: 200,
      start: start,
      limit: limit,
      result: result_slice,
      message:
        "Please note that the start plus the limit exceeds number of data in the database!",
    });
    return;
  }
  if (result_slice.length === 0) {
    // result
    res
      .status(404)
      .json({ status: 404, result: result_slice, message: "Nothing found!" });
  } else {
    res.status(200).json({
      status: 200,
      start: start,
      limit: limit,
      result: result_slice,
      message: "Fonud!",
    });
  }

  client.close();
};

const deleteGreeting = async (req, res) => {
  const _id = req.params._id;
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_2");

  // delete
  try {
    let result = await db.collection("greetings").deleteOne({ _id });
    //result = result.deletedCount;
    // check
    //console.log(result);
    assert.strictEqual(1, result.deletedCount);
    res
      .status(204)
      .json({ status: 204, message: `One item deleted: id: ${_id}` });
    client.close();
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: 404, message: `Error occured.` });
    client.close();
  }

  return;
};

const updateGreeting = async (req, res) => {
  const _id = req.params._id;
  if (!_id || _id === "" || _id === []) {
    res.status(400).json({ status: 200, _id, message: "_id not provuded" });
    return;
  }
  // verify new value
  const newV = { ...req.body };
  if (
    !Object.keys(newV).includes("hello") /*|| Object.values(newV).length > 1*/
  ) {
    res.status(400).json({
      status: 200,
      _id,
      message: "The input doesn't include 'hello'.",
    });
    return;
  }

  // update to db
  const query = { _id };
  const newValues = { $set: { hello: req.body["hello"] } };
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_2");
  let result;

  try {
    result = await db.collection("greetings").updateOne(query, newValues);
    assert.strictEqual(1, result.modifiedCount);
    res.status(200).json({ status: 200, _id, ...req.body });
    return;
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ status: 400, _id, error: "Something went wrong in updating." });
    return;
  }
  //console.log(result);
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
