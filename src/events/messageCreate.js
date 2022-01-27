const { MessageEmbed } = require('discord.js')
const guildSchema = require('../models/guildSchema');
const ticketSchema = require('../models/ticketSchema');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        if (!message.guild) return;

        let guildProfile = await guildSchema.findOne({ GuildID: message.guild.id })
        if (!guildProfile) {
            guildProfile = await new guildSchema({
                GuildID: message.guild.id
            });
            await guildProfile.save().catch(err => console.log(err));
        }

        let ticketProfile = await ticketSchema.findOne({ GuildID: message.guild.id, ChannelID: message.channel.id })
        if (ticketProfile) {
            if (guildProfile.TEnabled == "true") {
                const msg = { content: message.content, created_at: message.createdAt }

                const logsArray = ticketProfile.Logs; 
                logsArray.push(msg)

                await ticketSchema.findOneAndUpdate({ GuildID: message.guild.id, ChannelID: message.channel.id }, { Logs: logsArray });
            }
        }
        
        if (message.author.bot) return

        const user = await client.levels.fetch(message.author.id, message.guild.id)

        const requiredXp = client.levels.xpFor(parseInt(user.level) +1)

        const randomAmountOfXp = Math.floor(Math.random() * 29) +1;
        const hasLeveledUp = await client.levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp)

        if (hasLeveledUp) {
            const user = await client.levels.fetch(message.author.id, message.guild.id)

            const levelEmbed = new MessageEmbed()
                .setTitle('New Level!')
                .setDescription(`**GG** ${message.author}, You just leveld up to level **${user.level}**`)
                .setColor("DARK_VIVID_PINK")

            const sendEmbed = await message.channel.send({ embeds: [levelEmbed] })
            sendEmbed.react('🥳')
        }


    },
};