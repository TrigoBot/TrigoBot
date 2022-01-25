const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('about this bot!'),
	async execute(interaction, client) {
		const Embed = new MessageEmbed()
			.setColor('BLUE')
			.setTitle('About me:')
			.addFields(
				{ name: 'Development', value: `This bot is being developed by <@!405176812684181514> and <@!521743464061468672>`},
                { name: 'Code', value: `This bot is open-source, check it out https://github.com/TrigoBot/TrigoBot`},
        { name: 'Support', value: `For support, please join our discord server: https://discord.gg/hS9q2H8fkX`},
			)
		await interaction.reply({embeds: [Embed] });
	},
};
