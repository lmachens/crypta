const express = require("express");

const app = express();
const port = 8000;

app.get("/", (request, response) => {
  response.send("<b>Hallo fische</b>");
});

app.get("/passwords/:name", (request, response) => {
  const { name } = request.params;
  response.send(`${name} password:`);
});

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});
