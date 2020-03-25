const {
  get,
  set,
  unset,
  reset,
  changeMasterPassword,
} = require("./lib/commands");
const {
  askForPassword,
  askForMasterPassword,
  askQuestion,
} = require("./lib/questions");
const { readMasterPassword } = require("./lib/passwords");
const { verifyHash } = require("./lib/crypto");

const [command, key] = process.argv.slice(2);

async function run() {
  const answeredMasterPassword = await askForMasterPassword();

  if (command === "reset") {
    return reset(answeredMasterPassword);
  }

  if (command === "change") {
    const answer = await askQuestion(
      "Are you sure you want to change your master password? (y/n)"
    );
    if (answer !== "y") {
      return;
    }

    const newMasterPassword = await askQuestion(
      "Please enter new master password:"
    );
    return changeMasterPassword(newMasterPassword);
  }

  const masterPassword = readMasterPassword();

  if (!verifyHash(answeredMasterPassword, masterPassword)) {
    console.error("Fuck off!");
    return;
  }

  if (command === "get") {
    get(key);
  } else if (command === "set") {
    const password = await askForPassword(key);
    set(key, password);
  } else if (command === "unset") {
    unset(key);
  } else {
    console.error("Unknown command");
  }
}

run();
