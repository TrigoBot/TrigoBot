const { MessageEmbed, Interaction } = require('discord.js');

module.exports = function generateQueueEmbed(LB, interaction) {
    const embeds = [];

    let k = 10;
    for (let i = 0; i < LB.length; i += 10) {
        const current = LB.slice(i, k);
        let j = i;
        k += 10;
        const info = current.map(lb => `**${++j}:** <@${lb.userID}> | Level **${lb.level}** | **${lb.xp}** xp`).join('\n');
        const embed = new MessageEmbed()
            .setDescription(`Leaderboard for ${interaction.guild.name}\n${info}`);
        embeds.push(embed)
    }
    return embeds;
}