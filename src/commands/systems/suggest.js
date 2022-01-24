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


        async execute(interaction){
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
            
            const Buttons = new MessageActionRow();
            Buttons.addComponents(
                new MessageButton().setCustomId("suggest-accept").setLabel("✅ Accept").setStyle("SUCCESS"),
                new MessageButton().setCustomId("suggest-decline").setLabel("❌ Decline").setStyle("DANGER")
            )

            try{

                const M = await interaction.reply({embeds: [Embed], components: [Buttons], fetchReply: true});

                await DB.create({GuildID: guildId, MessageID:  M.id, Details: [
                    {
                        MemberID: member.id,
                        Type: Type,
                        Suggestion: Suggestion
                    }
                ]})

            } catch (err) {
                console.log(err);
            }

        }

        

}