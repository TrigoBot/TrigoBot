const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Display the queue')
        .addStringOption(option =>
            option.setName('page')
                .setDescription('page 1-99')
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
        
		await interaction.reply(`🎵 Added ${args.value} to the queue 🎵`);
	},
};