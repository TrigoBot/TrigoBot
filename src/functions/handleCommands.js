const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');
const fs = require('fs');

const clientId = process.env.ID;
const guildId = process.env.GUILD;

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                // Set a new item in the Collection
                // With the key as the command name and the value as the exported module
                client.commands.set(command.data.name, command, );
                client.commandArray.push(command.data.toJSON());
            }
        }
        const rest = new REST({
            version: '9'
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                
                if (!guildId) {
                    console.log('\x1b[32m%s\x1b[0m', 'Global Started refreshing application (/) commands.');
                    await rest.put(
                        Routes.applicationCommands(clientId), {
                            body: client.commandArray
                        }
                    )
                } else {
                    console.log('\x1b[32m%s\x1b[0m', 'Local Started refreshing application (/) commands.');
                    await rest.put(
                        Routes.applicationGuildCommands(clientId, guildId), {
                            body: client.commandArray
                        },
                    );
                }

                console.log('\x1b[32m%s\x1b[0m', 'Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error('\x1b[31m%s\x1b[0m', error);
            }
        })();
    }
}