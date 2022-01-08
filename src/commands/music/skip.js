const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Vote = require('../../models/voteSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Vote skip a song'),
	async execute(interaction, client) {
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

        let userC = interaction.member.voice.channel.members.size;
        let required = Math.ceil(userC/2);

        if (voteProfile.votes.includes(interaction.member.id)) {
            return interaction.reply(`You already voted to skip \`${queue.songs[0].name}\``);
        }

        
        if (voteProfile.votes.length+1 >= required) {
            await Vote.findOneAndDelete({ guildId: interaction.guildId });
            interaction.client.distube.skip(interaction.guildId)
            interaction.reply(`Skipped \`${queue.songs[0].name}\``)
        } else {
            const votearray = voteProfile.votes;
            votearray.push(interaction.member.id);
    
            await Vote.findOneAndUpdate({ guildId: interaction.guildId }, { votes: votearray });
            return interaction.reply(`You voted to skip \`${queue.songs[0].name}\`\n\`${voteProfile.votes.length}\`/\`${required}\` Votes`)
        }
	},
};