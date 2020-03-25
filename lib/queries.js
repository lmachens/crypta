const { getCollection } = require("./db");

function getMasterPasswordsCollection() {
  return getCollection("masterPasswords");
}

async function getMasterPassword() {
  const masterPassword = await getMasterPasswordsCollection().findOne();
  return masterPassword.password;
}

exports.getMasterPassword = getMasterPassword;
