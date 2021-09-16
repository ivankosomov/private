const { Collection } = require("discord.js")
const voiceCollection = new Collection()
const cfg = require("../config.json")
const client = global.client;

module.exports = async (oldState, newState) => {
    const user = await client.users.fetch(newState.id)
    const member = newState.guild.member(user)
    const guild = client.guilds.cache.get(cfg.sunucuID)
    let everyone = guild.roles.cache.find(role => role.name === "@everyone");
    if(!oldState.channel && newState.channel.id === cfg.girilcekkanal) {
        const channel = await newState.guild.channels.create(user.tag + "'s Private Room", {
            type: "voice",
            parent: newState.channel.parent,
            permissionOverwrites: [{
                id: user.id,
                allow:["CONNECT", "CREATE_INSTANT_INVITE", "MANAGE_CHANNELS", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS"]
            },
            {
                id: everyone,
                deny: ["CONNECT"]
            }]
        })
        member.voice.setChannel(channel)
        voiceCollection.set(user.id, channel.id)
    } else if(!newState.channel) {
        if(oldState.channelID === voiceCollection.get(newState.id))
        return oldState.channel.delete({reason: "Kanal sahibi kanalından çıktığı için silindi."})
    }

}

module.exports.configuration = {
  name: "voiceStateUpdate"
}