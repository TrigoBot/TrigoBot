const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('about this bot!'),
	async execute(interaction, client) {
		const Embed = new MessageEmbed()
			.setColor('BLUE')
			.setTitle('about:')
			.addFields(
				{ name: 'Use', value: `This bot is our all in one super discord bot.`},
				{ name: 'Development', value: `This bot is mainly developed by Jelyko#6300 and simple commands are done by me Baerke#5288`},
                { name: 'Repo', value: `This bot is open-source so if you're interested go look at TrigoBot`},
        { name: 'Support', value: `If you have any problems with our bot you can join our support server: https://discord.gg/hS9q2H8fkX`},
			)
		await interaction.reply({embeds: [Embed] });
	},
};
