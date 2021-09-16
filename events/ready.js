const cfg = require("../config.json")
const client = global.client;
module.exports = () => {
  console.log("Bot aktif!");
  client.user.setActivity(cfg.status);
}
module.exports.configuration = {
  name: "ready"
}