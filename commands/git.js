const cfg = require("../config.json")
const { Discord, MessageEmbed, Collection } = require("discord.js")
const moment = require("moment")
require("moment-duration-format");
moment.locale("tr")

module.exports.execute = async (client, message, args, embed) => {
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!member) return message.channel.send(embed.setDescription("**Odasına gitme talebinde bulunmak istediğin kullanıcıyı etiketlemelisin.**")).then(msj => msj.delete({timeout:5000}));
  if (!message.member.voice.channel) return message.channel.send(embed.setDescription("**Bu komutu kullanabilmek için sesli kanallardan birinde bulunmalısın.**")).then(msj => msj.delete({timeout:5000}));
  if (!member.voice.channel) return message.channel.send(embed.setDescription("**Oda talebi gerçekleştirilemedi. Kullanıcı herhangi bir sesli kanalda değil.**")).then(msj => msj.delete({timeout:5000}));
  if (message.member.voice.channel.id === member.voice.channel.id) return message.channel.send("**Oda talebi gerçekleştirilemedi. Üye ile aynı kanaldasınız.**").then(msj => msj.delete({timeout:5000}));
  const filter = (reaction, user) => {
    return ([cfg.ok, cfg.no].includes(reaction.emoji.id) && user.id === member.id);
  };
  const ivan = new MessageEmbed()
  .setTitle(`Odaya gelme isteği`)
  .setDescription(`Merhaba ${member}. ${message.author} adlı üye bulunduğun sesli kanalına gelmek istiyor. \nBu mesaj balonunda gösterilen tepkiler ile talebini kabul edebilir veya reddedebilirsin.`)
  .setColor("BLACK")
   let mesaj = await message.channel.send(`${member}`,ivan)
  await mesaj.react(cfg.ok);
  await mesaj.react(cfg.no);
  mesaj.awaitReactions(filter, {
    max: 1,
    time: 60000,
    errors: ["time"]
  }).then(collected => {
  const reaction = collected.first();
  if (reaction.emoji.id === cfg.ok) {
  let kabul = new MessageEmbed()
  .setTitle(`Kabul`)
  .setDescription(`${message.author} adlı üye başarıyla ${member} adlı üyenin odasına taşındı.`)
  .setColor("BLACK")
  message.channel.send(kabul).then(msg => { msg.delete({ timeout: 10000 }) })
  message.member.voice.setChannel(member.voice.channel);
  } else {
  let redd = new MessageEmbed()
  .setTitle(`Red`)
  .setDescription(`${member} adlı üye ${message.author} adlı kullanıcının gitme isteğini reddetti`)
  .setColor("BLACK")
  message.channel.send(redd).then(msg => { msg.delete({ timeout: 10000 }) })
  }
})
};
module.exports.configuration = {
  name: "git",
  aliases: ["odaizni", "girisizni", "tp", "go"],
};