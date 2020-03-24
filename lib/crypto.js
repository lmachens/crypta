const crypto = require("crypto");
const { readMasterPassword } = require("./passwords");

let resizedIV = Buffer.allocUnsafe(16);
const iv = crypto.createHash("sha256").update("myHashedIV").digest();
iv.copy(resizedIV);

function getCipherKey(masterPassword) {
  return crypto.createHash("sha256").update(masterPassword).digest();
}

function encrypt(value) {
  const masterPassword = readMasterPassword();
  const cipherKey = getCipherKey(masterPassword);

  const cryptoCipher = crypto.createCipheriv("aes256", cipherKey, resizedIV);

  let encryptedValue = cryptoCipher.update(value, "utf-8", "hex");
  encryptedValue += cryptoCipher.final("hex");

  return encryptedValue;
}

function decrypt(encryptedValue) {
  const masterPassword = readMasterPassword();
  const cipherKey = getCipherKey(masterPassword);

  const cryptoCipher = crypto.createDecipheriv("aes256", cipherKey, resizedIV);

  let decryptedValue = cryptoCipher.update(encryptedValue, "hex", "utf-8");
  decryptedValue += cryptoCipher.final("utf-8");

  return decryptedValue;
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;
