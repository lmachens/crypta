const express = require("express");
const { connect } = require("./lib/db");
const { getPassword } = require("./lib/queries");

const app = express();
const port = 8000;

app.get("/", (request, response) => {
  response.send("<b>Hallo fische</b>");
});

app.get("/passwords/:name", async (request, response) => {
  const { name } = request.params;
  const password = await getPassword(name);
  response.send(password);
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
