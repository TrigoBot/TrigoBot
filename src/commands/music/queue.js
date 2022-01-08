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
const generateQueueEmbed = require('../../ExFunctions/generateQueueEmbed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the queue'),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guildId)

        const embeds = generateQueueEmbed(queue.songs)

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
        //await interaction.reply({ content: `Current Page: ${currentPage+1}/${embeds.length}`, embeds: [embeds[currentPage]], components: [row] })
    },
};