const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop playing music'),
    permissions: [ Permissions.FLAGS.MOVE_MEMBERS],
	async execute(interaction, client) {
        if (!interaction.member.voice.channel) return interaction.reply({ content: `You must be in a voice channel`, ephemeral: true })
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: `You must be in the same voice channel as me`, ephemeral: true })

        interaction.client.distube.stop(
            interaction.guildId,
        );
        
		await interaction.reply(`🛑 Stopped the queue`);
	},
};