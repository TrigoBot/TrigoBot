const { SlashCommandBuilder } = require('@discordjs/builders');
const {CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const DB = require("../../models/suggestSchema");

module.exports = {
    data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('suggest something')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('select a type of suggestion')
                .setRequired(true)
                    .addChoice('Command', 'Command')
                    .addChoice('Eventlistner', 'Eventlistener')
                    .addChoice('System', 'System')
                    .addChoice('Other', 'Other')           
                    )
        .addStringOption(option =>
            option.setName('suggestion')
                .setDescription('describe your suggestion')
                .setRequired(true)),

    /**
     * 
     * @param {CommandInteraction} interaction  
     */


        async execute(interaction, client){
            const { options, guildId, member, user } = interaction;
            const Type = options.getString("type");
            const Suggestion = options.getString("suggestion");
            const pfp = user.displayAvatarURL();

            const Embed = new MessageEmbed()
			.setColor('NAVY')
            .setAuthor({ name: user.tag, iconURL: pfp })
			.addFields(
                {name: "Suggestion:", value: Suggestion, inline: false},
                {name:"Type:", value: Type, inline: true },
                {name:"Status:", value: "Pending", inline: true}
            )
            .setTimestamp()

            const cEmbed = new MessageEmbed()
			.setColor('NAVY')
            .setAuthor({ name: user.tag, iconURL: pfp })
			.addFields(
                {name: "Suggestion:", value: Suggestion, inline: false},
                {name:"Type:", value: Type, inline: true },
            )
            .setTimestamp()
            
            const Buttons = new MessageActionRow();
            Buttons.addComponents(
                new MessageButton().setCustomId("suggest-accept").setLabel("✅ Accept").setStyle("SUCCESS"),
                new MessageButton().setCustomId("suggest-decline").setLabel("❌ Decline").setStyle("DANGER")
            )

            try{

                const M = await interaction.reply({embeds: [cEmbed], fetchReply: true});

                let suggestchannel = client.channels.cache.get(`935202950207397928`);
                const N = await suggestchannel.send({
                    embeds: [Embed],
                    components: [Buttons],
                })

                await DB.create({GuildID: guildId, MessageID:  M.id, SuggestID: N.id, Details: [
                    {
                        MemberID: user.id,
                        Type: Type,
                        Suggestion: Suggestion
                    }
                ]})

            } catch (err) {
                console.log(err);
            }

        }

        

}