const {
    SlashCommandBuilder,
    Embed
} = require('@discordjs/builders');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const paginationEmbed = require('discordjs-button-pagination');
const generateLeaderboardEmbed = require('../../ExFunctions/generateLeaderboardEmbed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Display the leaderboard'),
    async execute(interaction, client) {
        const LB = await client.levels.fetchLeaderboard(interaction.guild.id, 100)
        
        const embeds = generateLeaderboardEmbed(LB, interaction)

        const button1 = new MessageButton()
            .setCustomId('previousbtn')
            .setLabel('Previous')
            .setStyle('DANGER');
        const button2 = new MessageButton()
            .setCustomId('nextbtn')
            .setLabel('Next')
            .setStyle("SUCCESS");
        const buttonList = [ button1, button2 ];

        paginationEmbed(interaction, embeds, buttonList, 10000);
    },
};