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
const { getMasterPassword } = require("./lib/queries");
const { verifyHash } = require("./lib/crypto");
const { connect, close } = require("./lib/db");

const [command, key] = process.argv.slice(2);

async function run() {
  try {
    // Connect with db
    await connect();
    const answeredMasterPassword = await askForMasterPassword();
    const masterPassword = await getMasterPassword();

    if (command === "reset") {
      await reset(answeredMasterPassword);
      return;
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
      await changeMasterPassword(newMasterPassword, masterPassword);
      return;
    }

    if (!verifyHash(answeredMasterPassword, masterPassword)) {
      console.error("Fuck off!");
      return;
    }

    if (command === "get") {
      await get(key, masterPassword);
    } else if (command === "set") {
      const password = await askForPassword(key);
      await set(key, password, masterPassword);
    } else if (command === "unset") {
      await unset(key);
    } else {
      console.error("Unknown command");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await close();
  }
}

run();
