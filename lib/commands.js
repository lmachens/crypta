const { hashPassword, encrypt, decrypt } = require("./crypto");
const {
  getPassword,
  setPassword,
  unsetPassword,
  setMasterPassword,
  unsetPasswords,
  getAllPasswords,
} = require("./queries");

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

async function reset(masterPassword) {
  await setMasterPassword(hashPassword(masterPassword));
  await unsetPasswords();

  console.log("Reseted database with new master password");
}

async function changeMasterPassword(newMasterPassword, masterPassword) {
  const newMasterPasswordHash = hashPassword(newMasterPassword);
  const passwordDocuments = await getAllPasswords();

  const promises = passwordDocuments.map(async (passwordDocument) => {
    const decryptedPassword = decrypt(
      passwordDocument.password,
      masterPassword
    );
    const encryptedPassword = encrypt(decryptedPassword, newMasterPasswordHash);
    return setPassword(passwordDocument.name, encryptedPassword);
  });

  await Promise.all(promises);
  await setMasterPassword(newMasterPasswordHash);
}

exports.get = get;
exports.set = set;
exports.unset = unset;
exports.reset = reset;
exports.changeMasterPassword = changeMasterPassword;
