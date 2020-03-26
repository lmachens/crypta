const express = require("express");
const { connect } = require("./lib/db");
const { getPassword, getMasterPassword } = require("./lib/queries");
const { decrypt, verifyHash } = require("./lib/crypto");

const app = express();
const port = 8000;

app.get("/", (request, response) => {
  response.send("<b>Hallo fische</b>");
});

app.get("/passwords/:name", async (request, response) => {
  const { name } = request.params;

  const password = await getPassword(name);

  if (!password) {
    response.status(404);
    response.send(`${name} not found 🐱‍👤`);
    return;
  }

  const userMasterPassword = request.headers["master-password"];
  const masterPassword = await getMasterPassword();
  if (!userMasterPassword || !verifyHash(userMasterPassword, masterPassword)) {
    response.status(403).send("Fuck off!");
    return;
  }

  const decryptedPassword = decrypt(password, masterPassword);
  response.send(decryptedPassword);
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
