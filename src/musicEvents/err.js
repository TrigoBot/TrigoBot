module.exports = {
    name: 'err',
    async execute(channel, error) {
        channel.send("An error encountered: " + error)
    },
};