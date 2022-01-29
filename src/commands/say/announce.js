const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, CommandInteraction, Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Announce something through the bot')
        .addRoleOption(role => 
            role.setName('role')
                .setDescription('Role to ping')
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('Select channel you want to send the message in')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Type out the message to announce')
                .setRequired(true)),
    
    permissions: [ Permissions.FLAGS.ADMINISTRATOR],

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */


    async execute(interaction) {
        const { options } = interaction;
        const ping = options.getRole("role");
        const Channel = options.getChannel('channel');
        const message = options.getString('message');
        const user = interaction.member.id;

        const Embed = new MessageEmbed()
        .setColor('NAVY')
        .addFields(
            {name: "Announcement:", value: message, inline: false},
            {name:"‎", value: `By: <@!${user}>`, inline: true })
        .setTimestamp();

        await Channel.send({content: `${ping}`, embeds: [Embed] }).then(interaction.reply({content:'Announcement sent', ephemeral: true}))
        
    }

}