const [command, key, value] = process.argv.slice(2);

function get() {
  console.log("Called GET", key);
  // Read and log db.json
  console.log("db");
}

function set() {
  console.log("Called SET", key, value);
}

if (command === "get") {
  get();
} else if (command === "set") {
  set();
} else {
  console.error("Unknown command");
}
