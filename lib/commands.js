const { readPasswords, writePasswords, writeDB } = require("./passwords");
const { hashPassword, encrypt, decrypt } = require("./crypto");
const { getPassword, setPassword, unsetPassword } = require("./queries");

async function get(key, masterPassword) {
  console.log("Called GET", key);
  // Read and log db.json
  const encryptedPassword = await getPassword(key);

  const password = decrypt(encryptedPassword, masterPassword);
  console.log(key, password);
}

async function set(key, value, masterPassword) {
  console.log("Called SET", key, value);
  const encryptedValue = encrypt(value, masterPassword);
  await setPassword(key, encryptedValue);
}

async function unset(key) {
  console.log("Called UNSET", key);
  await unsetPassword(key);
}

function reset(masterPassword) {
  const db = {
    masterPassword: hashPassword(masterPassword),
    passwords: {},
  };

  writeDB(db);
  console.log("Reseted database with new master password");
}

function changeMasterPassword(newMasterPassword) {
  const passwords = readPasswords();
  const passwordKeys = Object.keys(passwords);

  const passwordsDecrypted = {};
  passwordKeys.forEach((passwordKey) => {
    const value = passwords[passwordKey];
    passwordsDecrypted[passwordKey] = decrypt(value);
  });

  const db = {
    masterPassword: hashPassword(newMasterPassword),
    passwords: passwords,
  };

  writeDB(db);

  const passwordsEncrypted = {};
  passwordKeys.forEach(async (passwordKey) => {
    const value = passwordsDecrypted[passwordKey];
    passwordsEncrypted[passwordKey] = encrypt(value);
  });

  writePasswords(passwordsEncrypted);
}

exports.get = get;
exports.set = set;
exports.unset = unset;
exports.reset = reset;
exports.changeMasterPassword = changeMasterPassword;
