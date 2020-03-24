const fs = require("fs");

function readDB() {
  const dbJSON = fs.readFileSync("./db.json", "utf8");
  const db = JSON.parse(dbJSON);
  return db;
}

function writeDB(db) {
  fs.writeFileSync("./db.json", JSON.stringify(db, null, 2));
}

function readPasswords() {
  const db = readDB();
  return db.passwords;
}

function writePasswords(passwords) {
  const db = readDB();
  db.passwords = passwords;
  writeDB(db);
}

function readMasterPassword() {
  const db = readDB();
  return db.masterPassword;
}

exports.readDB = readDB;
exports.writeDB = writeDB;
exports.readPasswords = readPasswords;
exports.writePasswords = writePasswords;
exports.readMasterPassword = readMasterPassword;
