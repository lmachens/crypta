const fs = require("fs");

const [command, key, value] = process.argv.slice(2);

function get() {
  console.log("Called GET", key);
  // Read and log db.json
  try {
    const passswordsJSON = fs.readFileSync("./db.json", "utf8");
    const passwords = JSON.parse(passswordsJSON);
    console.log(key, passwords[key]);
  } catch (error) {
    console.error(error);
  }
}

function set() {
  console.log("Called SET", key, value);
  try {
    // Read db.json
    const passwordsJSON = fs.readFileSync("./db.json", "utf8");
    const passwords = JSON.parse(passwordsJSON);
    // Update value by key
    passwords[key] = value;
    // Write db.json
    fs.writeFileSync("./db.json", JSON.stringify(passwords, null, 2));
  } catch (error) {
    console.error(error);
  }
}

if (command === "get") {
  get();
} else if (command === "set") {
  set();
} else {
  console.error("Unknown command");
}
