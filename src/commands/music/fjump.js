const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const mongoose = require('mongoose');
const Vote = require('../../models/voteSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fjump')
		.setDescription('Force jump | Only for users with MOVE_MEMBERS permission')
        .addNumberOption(option =>
            option.setName('position')
                .setDescription('Position of the song you want to skip to.')
                .setRequired(true)),
    permissions: [ Permissions.FLAGS.MOVE_MEMBERS],
	async execute(interaction, client) {
        let args = interaction.options.get("position")

        if (!interaction.member.voice.channel) return interaction.reply({ content: `You must be in a voice channel`, ephemeral: true })
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: `You must be in the same voice channel as me`, ephemeral: true })
        
        const queue = client.distube.getQueue(interaction.guildId)
        const song = queue.songs[args.value-1].name

        if (!song) return interaction.reply({ content: `There isnt a song at position ${args.value-1}`, ephemeral: true })
        
        interaction.client.distube.jump(interaction.guildId, args.value-1)
        interaction.reply(`Force jumped to \`${song}\``)
	},
};