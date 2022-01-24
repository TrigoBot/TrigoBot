
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setPresence({ activities: [{ name: "/help | trigobot", type: `LISTENING`}], status: 'online' })

        console.log('\x1b[36m%s\x1b[0m', 'Discord Presence has been enabled.')
        console.log('\x1b[36m%s\x1b[0m', 'ready');
    },
};