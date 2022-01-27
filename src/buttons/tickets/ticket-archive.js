const { MessageEmbed, MessageButton, MessageActionRow, Permissions } = require('discord.js')
const guildSchema = require('../../models/guildSchema')
const ticketSchema = require('../../models/ticketSchema')
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: {
        name: `ticket-archive`
    },
    async execute (interaction, client) {
        let guildProfile = await guildSchema.findOne({ GuildID: interaction.guild.id })
        let ticketProfile = await ticketSchema.findOne({ GuildID: interaction.guild.id, ChannelID: interaction.channel.id })

        if (guildProfile.TRole) {
            if (!interaction.member.roles.cache.some(role => role.id === guildProfile.TRole)) {
                if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                    return interaction.reply({ content: `You cannot delete this ticket. Only Administrators or users with <@&${guildProfile.TRole}> can delete tickets`, ephemeral: true})
                }
            }
        }

        const Embed = new MessageEmbed()
            .setColor('YELLOW')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Archiving ${ticketProfile.ChannelName} in 3 seconds`)
            .setTimestamp()

        interaction.reply({ embeds: [Embed] })

        await wait(3000);

        await interaction.channel.delete(`${ticketProfile.ChannelName} Archived`)
        await ticketSchema.findOneAndUpdate({ GuildID: ticketProfile.GuildID, ChannelID: ticketProfile.ChannelID }, {
            Archived: true,
        })
    }
}