const express = require("express");
const { connect } = require("./lib/db");
const {
  getPassword,
  getMasterPassword,
  setPassword,
} = require("./lib/queries");
const { decrypt, encrypt, verifyHash } = require("./lib/crypto");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const port = 8000;

app.use(bodyParser.json()); // for parsing application/json

app.get("/", (request, response) => {
  const indexHTML = fs.readFileSync("./public/index.html", "utf8");
  response.set("Content-Type", "text/html");
  response.send(indexHTML);
});

// Check if the user knows the master password
// Middleware
app.use(async (request, response, next) => {
  const userMasterPassword = request.headers["master-password"];
  const masterPassword = await getMasterPassword();
  if (!userMasterPassword || !verifyHash(userMasterPassword, masterPassword)) {
    response.status(403).send("Fuck off!");
    return;
  }
  next();
});

app.get("/passwords/:name", async (request, response) => {
  const { name } = request.params;

  const password = await getPassword(name);

  if (!password) {
    response.status(404);
    response.send(`${name} not found 🐱‍👤`);
    return;
  }

  const masterPassword = await getMasterPassword();
  const decryptedPassword = decrypt(password, masterPassword);
  response.send(decryptedPassword);
});

app.post("/passwords", async (request, response) => {
  const { name, password } = request.body;

  const masterPassword = await getMasterPassword();
  const encryptedPassword = encrypt(password, masterPassword);
  await setPassword(name, encryptedPassword);
  response.status(201).send("Good job! Password created 🐱‍👤");
});

app.patch("/passwords/:name", async (request, response) => {
  const { name, password } = request.body;

  const existingPassword = await getPassword(name);
  if (!existingPassword) {
    response.status(404);
    response.send(`${name} not found 🐱‍👤`);
    return;
  }

  const masterPassword = await getMasterPassword();
  const encryptedPassword = encrypt(password, masterPassword);
  await setPassword(name, encryptedPassword);
  response.status(201).send("Good job! Password updated 🐱‍👤");
});

// async function startServer() {
//   await connect();
//   console.log("Database is connected");

//   app.listen(port, () => {
//     console.log(`Server is running http://localhost:${port}`);
//   });
// }
// startServer();

connect().then(() => {
  console.log("Database is connected");

  app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
  });
});
