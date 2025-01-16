const http = require("node:http");
const server = http.createServer();

require("./src/bot/bot.gateway").discordListener();

server.listen(process.env.SERVER_PORT, () => {
  console.log("Server is listening on port 3000");
});
