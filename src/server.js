const color = require("colors");
const app = require("./app");
const { default: mongoose } = require("mongoose");
const config = require("./config");
const socketIo = require("socket.io");
const socketHandler = require("./helper/socketHelper");

//db connect here
async function main() {
  try {
    await mongoose.connect(config.database);
    console.log(color.green("♻️  Database connected successfully"));

    const server = app.listen(config.port, config.ip_address, () => {
      console.log(color.yellow("🚀 Application running on port", config.port));
    });
    
    //socket listen here
    const io = socketIo(server, {
      pingTimeout: 60000,
      cors: {
        origin: "*",
      },
    });

    socketHandler(io);
    global.io = io;

    
  } catch (error) {
    console.log("🤢 Failed to connect database", error);
  }
}

main();
