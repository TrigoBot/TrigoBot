const DB = require("../../models/suggestSchema");
const {MessageEmbed} = require('discord.js');

module.exports = {
    data: {
        name: `suggest-accept`
    },
    async execute (interaction, client) {
        const { guildId, customId, message } = interaction;

        let suggestProfile = await DB.findOne({ guildId: interaction.guildId, SuggestID: message.id })

        const Embed = message.embeds[0];
        if(!Embed) return;

        Embed.fields[2] = {name:"Status:", value: "Accepted", inline: true};

        message.edit({embeds: [Embed.setColor("GREEN")], components: []});
        interaction.reply({content: "Suggestion accepted, Messaged the Suggestor", ephemeral: true})

        //const user = client.users.cache.get(suggestProfile.Details.MemberID)
        
        const { Suggestion, Type, MemberID } = suggestProfile.Details[0]
        const user = await client.users.cache.get(MemberID)

        const uEmbed = new MessageEmbed()
        .setColor('GREEN')
        .addFields(
            {name: "Suggestion:", value: Suggestion, inline: false},
            {name:"Type:", value: Type, inline: true },
            {name:"Status:", value: "Accepted", inline: true}
        )
        .setTimestamp()
        .setDescription('For support [Join our discord](https://discord.gg/8DY6rJ9JbE)')

        user.send({ content: "Your suggestion has been accepted!", embeds: [uEmbed]})

        await DB.findOneAndUpdate({ guildId: interaction.guildId, SuggestID: message.id }, { Status: "Accepted" });
    }
}