const { getCollection } = require("./db");

/**
 * Master Passwords
 */
function getMasterPasswordsCollection() {
  return getCollection("masterPasswords");
}

async function getMasterPassword() {
  const masterPassword = await getMasterPasswordsCollection().findOne();
  return masterPassword.password;
}

function deleteMasterPassword() {
  return getMasterPasswordsCollection().deleteOne();
}

async function setMasterPassword(newMasterPassword) {
  await deleteMasterPassword();
  return getMasterPasswordsCollection().insertOne({
    password: newMasterPassword,
  });
}

/**
 * Passwords
 */

function getPasswordsCollection() {
  return getCollection("passwords");
}

async function getPassword(name) {
  const passwordDocument = await getPasswordsCollection().findOne({ name });
  return passwordDocument.password;
}

function setPassword(name, password) {
  return getPasswordsCollection().updateOne(
    {
      name,
    },
    {
      $set: {
        password,
      },
    },
    { upsert: true }
  );
}

function unsetPassword(name) {
  return getPasswordsCollection().deleteOne({ name });
}

function unsetPasswords() {
  return getPasswordsCollection().deleteMany({});
}

exports.getMasterPassword = getMasterPassword;
exports.setMasterPassword = setMasterPassword;
exports.getPassword = getPassword;
exports.setPassword = setPassword;
exports.unsetPassword = unsetPassword;
exports.unsetPasswords = unsetPasswords;
