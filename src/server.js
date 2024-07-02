const color = require("colors");
const app = require("./app");
const { default: mongoose } = require("mongoose");
const config = require("./config");
require("dotenv").config();

//db connect here
async function main() {
  try {
    await mongoose.connect(config.database);
    console.log(color.green("♻️  Database connected successfully"));

    app.listen(config.port, config.ip_address, () => {
      console.log(color.yellow("🚀 Application running on port", config.port));
    });
  } catch (error) {
    console.log("🤢 Failed to connect database", error);
  }
}

main();
