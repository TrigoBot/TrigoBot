const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Add songs to the queue')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('URL or song name')
                .setRequired(true)),
	async execute(interaction, client) {
		let args = interaction.options.get("name")

        if (!interaction.member.voice.channel) return interaction.reply({ content: `You must be in a voice channel`, ephemeral: true })
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: `You must be in the same voice channel as me`, ephemeral: true })
        
        interaction.client.distube.playVoiceChannel(
            interaction.member.voice.channel,
            args.value,
            {
                textChannel: interaction.channel,
                member: interaction.member,
            }
            );
        await interaction.reply(`🎵 Adding...🎵`);
        const wait = require('util').promisify(setTimeout);
        await wait(2000);
        await interaction.editReply(`🎵 Added ${args.value} 🎵`)
	},
};