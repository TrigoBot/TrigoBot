const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction, Client, User, Permissions, Collection} = require('discord.js');

module.exports = {

	
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a member from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ping the member you want to kick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Why the member is being kickeda')
                .setRequired(true))
                .addStringOption(option =>
            option.setName('messages')
                .setDescription('delete messages?')
                .setRequired(true)
                    .addChoice('Dont delete any', '0')
                    .addChoice('The messages from the previous 7 days', '7')),

    permissions: [ Permissions.FLAGS.KICK_MEMBERS],
    
    /**
     * 
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */



	async execute(interaction) {
        const user = interaction.options.getMember('target');
        const Target= interaction.options.getUser('target');
        const string = interaction.options.getString('reason');
        const guild = interaction.guild
        const guildname = interaction.guild.name
        const amount = interaction.options.getString('messages');
        const member = interaction.guild.members.cache.get(user.id);
        const pfp = user.displayAvatarURL();
		const exampleEmbed = new MessageEmbed()
			.setColor('DARK_GREEN')
            .setAuthor({ name: ` ${Target.username} has been kicked`, iconURL: pfp})
			.setDescription(`Reason: ${string}.`)
            .setTimestamp()

        if (Target.id === interaction.member.id)
        return interaction.followup({embeds: [new MessageEmbed ().setColor('RED').setDescription(`⛔ You cannot kick yourself.`)], ephemeral: true})
        
        if (member.roles.highest.position >= interaction.member.roles.highest.position) 
        return interaction.reply({ content: '⛔ You can only kick people with a lower rank than yours.', ephemeral: true })

        if (interaction.guild.me.roles.highest.position <= member.roles.highest.position) 
        return interaction.reply({ content: '⛔ I cant kick this user, my rank is lower than theirs.', ephemeral: true })


        if (string.length > 500)
        return interaction.followup({embeds: [new MessageEmbed ().setColor('RED').setDescription(`⛔ The reason provided was longer than 500 characters`)], ephemeral: true})

        await Target.send(`You've been kicked from ${guildname} by ${member} for ${string}`);
		await user.kick({days: amount, reason: string}).then(() => interaction.reply({ embeds: [exampleEmbed] }))    
    },
};