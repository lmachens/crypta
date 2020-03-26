const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const dbName = "crypta";

let client;
function connect() {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Connect to the MongoDB
  return client.connect();
}

function close() {
  return client.close();
}

function getCollection(collectionName) {
  return client.db(dbName).collection(collectionName);
}

exports.connect = connect;
exports.close = close;
exports.getCollection = getCollection;
