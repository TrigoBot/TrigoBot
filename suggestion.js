const { ButtonInteraction } =  require ('discord.js');
const DB = require('../models/suggestSchema');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (!interaction.member.permissions.has("ADMINISTRATOR"))
        return interaction.reply({content: "you cannot use this button", ephemeral: true});

        const { guildId, customId, message } = interaction;

        DB.findOne({GuildID: guildId, MessageID: message.id}, async(err, data) => {
            if (err) throw err;
            if(!data) return interaction.reply({ content: `No data was found in the database`, ephemeral: true});

            const Embed = message.embeds[0];
            if(!Embed) return;
            
            switch(customId) {
                case "suggest-accept" : {
                    Embed.fields[2] = {name:"Status:", value: "Accepted", inline: true};
                    message.edit({embeds: [Embed.setColor("GREEN")], components: []});
                    interaction.reply({content: "Suggestion accepted", ephemeral: true})
                }
                break;

                case "suggest-decline": {
                    Embed.fields[2] = {name:"Status:", value: "Declined", inline: true};
                    message.edit({embeds: [Embed.setColor("RED")], components: []});
                    interaction.reply({content: "Suggestion declined", ephemeral: true})
                }
                break;
            }
        })

    }
}