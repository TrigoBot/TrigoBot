const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const mongoose = require('mongoose');
const Vote = require('../../models/voteSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fskip')
		.setDescription('Force skip a song | Only for users with MOVE_MEMBERS permission'),
    permissions: [ Permissions.FLAGS.MOVE_MEMBERS],
	async execute(interaction, client) {
        if (!interaction.member.voice.channel) return interaction.reply({ content: `You must be in a voice channel`, ephemeral: true })
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: `You must be in the same voice channel as me`, ephemeral: true })
        
        const queue = client.distube.getQueue(interaction.guildId)
        
        interaction.client.distube.skip(interaction.guildId)
        interaction.reply(`Force skipped \`${queue.songs[0].name}\``)
	},
};