module.exports = {
    name: 'error',
    async execute(channel, error) {
        const string = `${error}`
        if (string.includes("NO_RESULT")) {
            return channel.send("No results found")
        }
        channel.send("An error encountered: " + error)
    },
};