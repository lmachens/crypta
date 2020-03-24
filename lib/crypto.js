const crypto = require("crypto");

let resizedIV = Buffer.allocUnsafe(16);
const iv = crypto.createHash("sha256").update("myHashedIV").digest();
iv.copy(resizedIV);

function getMasterPassword(secret) {
  return crypto.createHash("sha256").update(secret).digest();
}

function encrypt(value) {
  const masterPassword = getMasterPassword("SUPER_SECRET_PASSWORD");

  const cryptoCipher = crypto.createCipheriv(
    "aes256",
    masterPassword,
    resizedIV
  );

  let encryptedValue = cryptoCipher.update(value, "utf-8", "hex");
  encryptedValue += cryptoCipher.final("hex");

  return encryptedValue;
}

function decrypt(encryptedValue) {
  const masterPassword = getMasterPassword("SUPER_SECRET_PASSWORD");

  const cryptoCipher = crypto.createDecipheriv(
    "aes256",
    masterPassword,
    resizedIV
  );

  let decryptedValue = cryptoCipher.update(encryptedValue, "hex", "utf-8");
  decryptedValue += cryptoCipher.final("utf-8");

  return decryptedValue;
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;
