const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageActionRow, MessageButton, MessageEmbed, Message} = require('discord.js');
const guildSchema = require('../../models/guildSchema');
const ticketSchema = require('../../models/ticketSchema');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Ticket System')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('First time setup')
                    .addChannelOption(option => option.setName('category').setDescription('Category to create new tickets in')
                    .setRequired(true))

                    .addRoleOption(role => role.setName('role').setDescription('Roles ot have access.'))

                    .addChannelOption(option => option.setName('channel').setDescription('Where to send ticket message to create new tickets'))
                    .addStringOption(option => option.setName('message').setDescription('What should be the embed description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('users')
                .setDescription('Add or remove members from ticket')  
                    .addStringOption(option => option.setName('action').setDescription('Select an action')
                    .setRequired(true)
                        .addChoice('add', "add")
                        .addChoice('remove', "remove"))
                    .addUserOption(option => option.setName('user').setDescription('The user')
                    .setRequired(true))
                    .addChannelOption(option => option.setName('channel').setDescription('Select the ticket'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('actions')
                .setDescription('Actions for tickets')
                    .addStringOption(option => option.setName('action').setDescription('Select an action')
                    .setRequired(true)
                        .addChoice('archive', "archive")
                        .addChoice('delete', "delete"))
                    .addChannelOption(option => option.setName('channel').setDescription('Select the ticket'))
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
     async execute(interaction, client) {
        const { options } = interaction;
        const Sub = options.getSubcommand();
        
        let guildProfile = await guildSchema.findOne({ GuildID: interaction.guild.id })
        if (!guildProfile) {
            guildProfile = await new guildSchema({
                GuildID: interaction.guild.id
            })
            await guildProfile.save().catch(err => console.log(err));
        }

        switch(Sub) {
            case "users" : {
                const choice = options.getString("action")
                const user = options.getUser("user")
                const channel = options.getChannel("channel") || interaction.channel;

                let guildProfile = await guildSchema.findOne({ GuildID: interaction.guild.id })
                let ticketProfile = await ticketSchema.findOne({ GuildID: interaction.guild.id, ChannelID: channel.id })

                if (guildProfile.TRole) {
                    if (!interaction.member.roles.cache.some(role => role.id === guildProfile.TRole)) {
                        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                            return interaction.reply({ content: `You cannot delete this ticket. Only Administrators or users with <@&${guildProfile.TRole}> can delete tickets`, ephemeral: true})
                        }
                    }
                }

                if (!ticketProfile) {
                    return interaction.reply({ content: `Ticket not found, Make sure your in a ticket channel or specifying the ticket`, ephemeral: true})
                }

                switch(choice) {
                    case "add" : {
                        channel.permissionOverwrites.create(user.id, {
                            'VIEW_CHANNEL': true,
                            'SEND_MESSAGES': true,
                        })

                        const Embed = new MessageEmbed()
                            .setColor('#ff1493')
                            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(`Added <@${user.id}> to <#${ticketProfile.ChannelID}>`)
                            .setTimestamp()

                        channel.send({ embeds: [Embed] })

                        interaction.reply({ content: `Added <@${user.id}> to <#${ticketProfile.ChannelID}>`, ephemeral: true})
                    }
                    break;

                    case "remove" : {
                        channel.permissionOverwrites.create(user.id, {
                            'VIEW_CHANNEL': false,
                            'SEND_MESSAGES': false,
                        })

                        const Embed = new MessageEmbed()
                            .setColor('#ff1493')
                            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(`Removed <@${user.id}> to <#${ticketProfile.ChannelID}>`)
                            .setTimestamp()

                        channel.send({ embeds: [Embed] })

                        interaction.reply({ content: `Removed <@${user.id}> to <#${ticketProfile.ChannelID}>`, ephemeral: true})
                    }
                }
            }
            break;

            case "actions" : {
                const choice = options.getString("action")
                const channel = options.getChannel("channel") || interaction.channel;
                
                let guildProfile = await guildSchema.findOne({ GuildID: interaction.guild.id })
                let ticketProfile = await ticketSchema.findOne({ GuildID: interaction.guild.id, ChannelID: channel.id })

                if (guildProfile.TRole) {
                    if (!interaction.member.roles.cache.some(role => role.id === guildProfile.TRole)) {
                        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                            return interaction.reply({ content: `You cannot delete this ticket. Only Administrators or users with <@&${guildProfile.TRole}> can delete tickets`, ephemeral: true})
                        }
                    }
                }

                if (!ticketProfile) {
                    return interaction.reply({ content: `Ticket not found, Make sure your in a ticket channel or specifying the ticket`, ephemeral: true})
                }

                switch(choice) {
                    case "delete" : {
                        const Embed = new MessageEmbed()
                            .setColor('RED')
                            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(`Deleting <#${ticketProfile.ChannelID}> in 3 seconds`)
                            .setTimestamp()

                        channel.send({ embeds: [Embed] })

                        interaction.reply({ content: `Deleting <#${ticketProfile.ChannelID}>`, ephemeral: true})

                        await wait(3000);

                        await channel.delete(`${ticketProfile.ChannelName} deleted`)
                        await ticketSchema.findOneAndDelete({ GuildID: ticketProfile.GuildID, ChannelID: ticketProfile.ChannelID })
                    }
                    break;

                    case "archive" : {
                        const Embed = new MessageEmbed()
                            .setColor('YELLOW')
                            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(`Archiving <#${ticketProfile.ChannelID}> in 3 seconds`)
                            .setTimestamp()

                        channel.send({ embeds: [Embed] })

                        interaction.reply({ content: `Archiving <#${ticketProfile.ChannelID}>`, ephemeral: true})

                        await wait(3000);

                        await channel.delete(`${ticketProfile.ChannelName} Archived`)
                        await ticketSchema.findOneAndUpdate({ GuildID: ticketProfile.GuildID, ChannelID: ticketProfile.ChannelID }, {
                            Archived: true,
                        })
                    }
                }
            }
            break;

            case "setup" : {
                if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                    return interaction.reply({ content: `You cannot setup the ticket system. Only members with ADMINISTRATOR permissin can`, ephemeral: true})
                }
                const channel = options.getChannel("channel") || interaction.channel;
                const category = options.getChannel("category")
                const role = options.getRole("role") || ""
                const message = options.getString("message") || "Use the buttons below to create a new ticket"

                await guildSchema.findOneAndUpdate({
                    GuildID: interaction.guild.id
                },{
                    TEnabled: "true",
                    TCategory: category.id,
                    TRole: role.id,
                    TNumber: 0,
                })

                const buttons = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('ticket-create')
                            .setLabel('🎫 Create')
                            .setStyle('PRIMARY')
                    )
                const Embed = new MessageEmbed()
                    .setColor('ORANGE')
                    .setTitle(" 🎫 Tickets 🎫")
                    .setDescription(message)

                await channel.send({ embeds: [Embed], components: [buttons] })
                interaction.reply({ content: "Sent the embed with buttons", ephemeral: true})
            }
        }
    },
};