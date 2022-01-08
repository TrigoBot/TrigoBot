module.exports = {
    name: 'addSong',
    async execute(queue, song) {
        console.log(`Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.member.displayName}.`)
    },
};