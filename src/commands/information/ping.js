const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction, client) {
		const Embed = new MessageEmbed()
			.setColor('BLUE')
			.setTitle('Pong!')
			.addFields(
				{ name: 'Latency', value: `${Math.round(client.ws.ping)}ms`}
			)
		await interaction.reply({embeds: [Embed] });
	},
};