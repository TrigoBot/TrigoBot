const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Change the bot volume')
        .addNumberOption(option =>
            option.setName('volume')
                .setDescription('Percentage 1-100%')),
	async execute(interaction, client) {
		let args = interaction.options.get("volume")

        if (!interaction.member.voice.channel) return interaction.reply({ content: `You must be in a voice channel`, ephemeral: true })
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: `You must be in the same voice channel as me`, ephemeral: true })
        
        const queue = client.distube.getQueue(interaction.guildId)

        if (!args) return interaction.reply({ content: `🔊 Volume at \`${queue.volume}%\``}) 

        if (args.value > 101) return interaction.reply({ content: `Percentage must be lowed than or equal to 100`, ephemeral: true})
        if (args.value < 1) return interaction.reply({ content: `Percentage must be higher than or equal to 1`, ephemeral: true})

        await interaction.reply(`🔊 Changed volume from \`${queue.volume}%\` to \`${args.value}%\``);
        
        interaction.client.distube.setVolume(
            interaction.guildId,
            args.value,
        );
	},
};