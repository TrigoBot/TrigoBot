const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Vote = require('../../models/voteSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jump')
		.setDescription('Vote to jump (skip) to a song in the queue')
        .addNumberOption(option =>
            option.setName('position')
                .setDescription('Position of the song you want to skip to.')
                .setRequired(true)),
	async execute(interaction, client) {
        let args = interaction.options.get("position")
		//VoteProfile
        let voteProfile = await Vote.findOne({  guildId: interaction.guildId })
        if (!voteProfile) {
            voteProfile = await new Vote({
                _id: mongoose.Types.ObjectId(),
                guildId: interaction.guildId,
            })
            await voteProfile.save().catch(err => console.log(err));
        }

        if (!interaction.member.voice.channel) return interaction.reply({ content: `You must be in a voice channel`, ephemeral: true })
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: `You must be in the same voice channel as me`, ephemeral: true })
        
        const queue = client.distube.getQueue(interaction.guildId)
        const song = queue.songs[args.value-1].name

        if (!song) return interaction.reply({ content: `There isnt a song at position ${args.value-1}`, ephemeral: true })

        let userC = interaction.member.voice.channel.members.size;
        let required = Math.ceil(userC/2);

        if (voteProfile.jump.includes(interaction.member.id)) {
            return interaction.reply(`You already voted to jump to \`${song}\``);
        }

        
        if (voteProfile.jump.length+1 >= required) {
            await Vote.findOneAndDelete({ guildId: interaction.guildId });
            interaction.client.distube.jump(interaction.guildId, args.value-1)
            interaction.reply(`Jumped to \`${song}\``)
        } else {
            const votearray = voteProfile.jump;
            votearray.push(interaction.member.id);
    
            await Vote.findOneAndUpdate({ guildId: interaction.guildId }, { jump: votearray });
            return interaction.reply(`You voted to jump to \`${song}\`\n\`${voteProfile.jump.length}\`/\`${required}\` Votes`)
        }
	},
};