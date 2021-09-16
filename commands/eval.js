const cfg = require("../config.json")

module.exports.execute = async (client, message, args) => {
  if(!cfg.owner.includes(message.author.id)) return
  if (!args[0] || args[0].includes('token')) return message.channel.send("Kod belirtilmedi `" + this.help.name + "`__`<kod>`__")

  const code = args.join(' ');
  function clean(text) {
    if (typeof text !== 'string')
      text = require('util').inspect(text, { depth: 0 })
    text = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
    return text;
  };
  try {
    var evaled = clean(await eval(code));
    if (evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace("token", "Fazla akıllısın!").replace(client.token, "Fazla akıllısın!").replace(process.env.PROJECT_INVITE_TOKEN, "Fazla akıllısın!");
    message.channel.send(`${evaled.replace(client.token, "Yasaklı komut").replace(process.env.PROJECT_INVITE_TOKEN, "Yasaklı komut")}`, { code: "js", split: true });
  } catch (err) { message.channel.send(err, { code: "js", split: true }) }
};
module.exports.configuration = {
  name: "eval",
  aliases: ["codetest"],
};