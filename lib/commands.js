const { readPasswords, writePasswords } = require("./passwords");

function get(key) {
  console.log("Called GET", key);
  // Read and log db.json
  try {
    // Read db.json
    const passwords = readPasswords();
    // Log password
    console.log(key, passwords[key]);
  } catch (error) {
    console.error(error);
  }
}

function set(key, value) {
  console.log("Called SET", key, value);
  try {
    // Read db.json
    const passwords = readPasswords();
    // Update value by key
    passwords[key] = value;
    // Write db.json
    writePasswords(passwords);
  } catch (error) {
    console.error(error);
  }
}

function unset(key) {
  console.log("Called UNSET", key);
  try {
    const passwords = readPasswords();
    delete passwords[key];
    writePasswords(passwords);
  } catch (error) {
    console.error(error);
  }
}

exports.get = get;
exports.set = set;
exports.unset = unset;
