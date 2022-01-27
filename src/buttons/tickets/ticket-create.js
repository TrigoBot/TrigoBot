const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const guildSchema = require('../../models/guildSchema')
const ticketSchema = require('../../models/ticketSchema')
module.exports = {
    data: {
        name: `ticket-create`
    },
    async execute (interaction, client) {
        let guildProfile = await guildSchema.findOne({ GuildID: interaction.guild.id })

        if (guildProfile.TEnabled == "false") {
            return interaction.reply({ content: "This guild has tickets disabled, Please ask an administrator to enable tickets.", ephemeral: true })
        }

        const number = 0000+guildProfile.TNumber

        await guildSchema.findOneAndUpdate({
            GuildID: interaction.guild.id
        },{
            TNumber: guildProfile.TNumber+1,
        })

        let userCheck = await ticketSchema.findOne({ GuildID: interaction.guild.id, UserID: interaction.user.id })
        if (userCheck) {
            return interaction.reply({ content: `You have already created a ticket, Your ticket is <#${userCheck.ChannelID}>`, ephemeral: true})
        }

        var channel

        if (guildProfile.TRole) {
            var channel = await interaction.guild.channels.create(`Ticket-#${'0'.repeat(4 - guildProfile.TNumber.toString().length)}${guildProfile.TNumber}`, {
                type: "text",
                permissionOverwrites: [{
                    id: guildProfile.TRole,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                }, {
                    id: interaction.guild.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                }, {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                }],
                parent: guildProfile.TCategory
            })
        } else {
            var channel = await interaction.guild.channels.create(`Ticket-#${'0'.repeat(4 - guildProfile.TNumber.toString().length)}${guildProfile.TNumber}`, {
                type: "text",
                permissionOverwrites: [{
                    id: interaction.guild.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                }, {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                }],
                parent: guildProfile.TCategory
            })
        }

        let ticketProfile = await new ticketSchema({
            GuildID: interaction.guild.id,
            UserID: interaction.user.id,
            ChannelID: channel.id,
            ChannelName: channel.name,
            Number: guildProfile.TNumber
        })
        await ticketProfile.save().catch(err => console.log(err));

        var Embed

        if (guildProfile.TLog) {
            var Embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle("Ticket")
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setDescription("This guild has logging inside tickets enabled,\nEverything said in here will be saved.")
                .addFields(
                    {name: "Created By:", value: interaction.user.tag, inline: false},
                )
                .setTimestamp()
        } else {
            var Embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle("Ticket")
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setDescription("Logging is disabled in this guild")
                .addFields(
                    {name: "Created By:", value: interaction.user.tag, inline: false},
                )
                .setTimestamp()
        }


        const buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ticket-delete')
                    .setLabel('🗑️ Delete')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomId('ticket-archive')
                    .setLabel('📁 Archive')
                    .setStyle('PRIMARY'),
            )

        channel.send({ content: `<@&${guildProfile.TRole}>` ,embeds: [Embed], components: [buttons] })
        interaction.reply({ content: `Created <#${channel.id}>`, ephemeral: true })
    }
}