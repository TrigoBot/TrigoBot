const { MessageEmbed } = require('discord.js');

module.exports = function generateQueueEmbed(queue) {
    const embeds = [];

    let k = 10;
    for (let i = 0; i < queue.length; i += 10) {
        const current = queue.slice(i, k);
        let j = i;
        k += 10;
        const info = current.map(song => `${++j}) [${song.name}](${song.url})`).join('\n');
        const embed = new MessageEmbed()
            .setDescription(`**[Current Song: ${queue[0].name}](${queue[0].url})**\n${info}`);
        embeds.push(embed)
    }
    return embeds;
}