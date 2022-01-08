
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const names = [
            `/help | Try Me`,
            `Britt 💪`,
            `Killer 🤡`,
            `Cian 🖤`,
            `Max 💦`,
        ]

        setInterval(() => {
            const status = names[Math.floor(Math.random()*names.length)]
            client.user.setPresence({ activities: [{ name: status, type: `WATCHING`}], status: 'online' })
        }, 10000)

        console.log('\x1b[36m%s\x1b[0m', 'Discord Presence has been enabled.')
        console.log('\x1b[36m%s\x1b[0m', 'ready');
    },
};