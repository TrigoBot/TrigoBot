const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { read } = require('fs');
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Same as `/reddit` except defaults to r/memes'),
	async execute(interaction, client) {
		const embed = new MessageEmbed();
		got(`https://www.reddit.com/r/memes/random/.json`)
				.then(response => {
					const [list] = JSON.parse(response.body);
					const [post] = list.data.children;

					const permalink = post.data.permalink;
					const memeUrl = `https://reddit.com${permalink}`;
					const memeImage = post.data.url;
					const memeTitle = post.data.title;
					const memeUpvotes = post.data.ups;
					const memeNumComments = post.data.num_comments;

					embed.setTitle(`${memeTitle}`);
					embed.setURL(`${memeUrl}`);
					embed.setColor('RANDOM');
					embed.setImage(memeImage);
					embed.setFooter(`👍 ${memeUpvotes} 💬 ${memeNumComments}`);

					if (post.data.over_18) {
						if (interaction.channel.nsfw) {
							interaction.reply({ embeds: [embed]})
						} else {
							interaction.reply({ content: "This post is NSFW and this channel isnt. Make sure your using nsfw channels for this.", ephemeral: true })
						}
					} else {
						interaction.reply({embeds: [embed]})
					}
			})
			.catch(console.error);
	},
};
