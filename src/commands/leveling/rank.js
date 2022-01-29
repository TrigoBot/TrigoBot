const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const cavacord = require("canvacord")
const guildSchema = require('../../models/guildSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Check your rank or someone elses rank')
		.addUserOption(option =>
            option.setName('target')
                .setDescription('The name of the member')
                .setRequired(false)),
	async execute(interaction, client) {
		const Target= interaction.options.getUser('target');
		let guildProfile = await guildSchema.findOne({ guildID: interaction.guild.id })

		if (!Target) {
			let user = await client.levels.fetch(interaction.user.id, interaction.guild.id)
			if (!user) {
				await client.levels.createUser(interaction.user.id, interaction.guild.id);
				let user = await client.levels.fetch(interaction.user.id, interaction.guild.id)

				const rank = new cavacord.Rank()
					.setAvatar (interaction.user.displayAvatarURL({ format: "jpg" }))
					.setCurrentXP (user.xp)
					.setRequiredXP (client.levels.xpFor(parseInt(user.level) +1))
					.setProgressBar(guildProfile.RankCard.ProgressBar)
					.setBackground(guildProfile.RankCard.BackgroundType, guildProfile.RankCard.BackgroundData)
					.setUsername (interaction.user.username)
					.setDiscriminator (interaction.user.discriminator)
					.setLevel (user.level)
					.setRank (1, 'RANK', false)

					rank.build()
						.then(data => {
							const attachment = new MessageAttachment(data, "RankCard.png");
							interaction.reply({ files: [attachment] });
						})
			} else {
				const rank = new cavacord.Rank()
					.setAvatar (interaction.user.displayAvatarURL({ format: "jpg" }))
					.setCurrentXP (user.xp)
					.setRequiredXP (client.levels.xpFor(parseInt(user.level) +1))
					.setProgressBar(guildProfile.RankCard.ProgressBar)
					.setBackground(guildProfile.RankCard.BackgroundType, guildProfile.RankCard.BackgroundData)
					.setUsername (interaction.user.username)
					.setDiscriminator (interaction.user.discriminator)
					.setLevel (user.level)
					.setRank (1, 'RANK', false)
	
					rank.build()
						.then(data => {
							const attachment = new MessageAttachment(data, "RankCard.png");
							interaction.reply({ files: [attachment] });
						})
			}
		} else {
			let user = await client.levels.fetch(Target.id, interaction.guild.id)
			if (!user) {
				await client.levels.createUser(Target.id, interaction.guild.id);
				let user = await client.levels.fetch(Target.id, interaction.guild.id)

				const rank = new cavacord.Rank()
					.setAvatar (Target.displayAvatarURL({ format: "jpg" }))
					.setCurrentXP (user.xp)
					.setRequiredXP (client.levels.xpFor(parseInt(user.level) +1))
					.setProgressBar(guildProfile.RankCard.ProgressBar)
					.setBackground(guildProfile.RankCard.BackgroundType, guildProfile.RankCard.BackgroundData)
					.setUsername (Target.username)
					.setDiscriminator (Target.discriminator)
					.setLevel (user.level)
					.setRank (1, 'RANK', false)
	
				rank.build()
					.then(data => {
						const attachment = new MessageAttachment(data, "Rankcard.png");
						interaction.reply({ files: [attachment] })
					})
			} else {
				const rank = new cavacord.Rank()
				.setAvatar (Target.displayAvatarURL({ format: "jpg" }))
				.setCurrentXP (user.xp)
				.setRequiredXP (client.levels.xpFor(parseInt(user.level) +1))
				.setProgressBar(guildProfile.RankCard.ProgressBar)
				.setBackground(guildProfile.RankCard.BackgroundType, guildProfile.RankCard.BackgroundData)
				.setUsername (Target.username)
				.setDiscriminator (Target.discriminator)
				.setLevel (user.level)
				.setRank (1, 'RANK', false)

				rank.build()
					.then(data => {
						const attachment = new MessageAttachment(data, "Rankcard.png");
						interaction.reply({ files: [attachment] })
					})
			}
		}
	},
};