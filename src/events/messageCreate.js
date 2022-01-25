const { MessageEmbed } = require('discord.js')
const guildSchema = require('../models/guildSchema');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        if (!message.guild) return;
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

        let guildProfile = await guildSchema.findOne({ guildID: message.guild.id })
        if (!guildProfile) {
            guildProfile = await new guildSchema({
                guildID: message.guild.id
            });
            await guildProfile.save().catch(err => console.log(err));
        }
    },
};