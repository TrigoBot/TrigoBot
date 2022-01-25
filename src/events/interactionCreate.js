const DB = require('../models/suggestSchema');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
    
            if (!command) return;
    
            try {
                if (command.permissions && command.permissions.length > 0) {
                    if (!interaction.member.permissions.has(command.permissions)) return await interaction.reply({ content: `You do not have permission to use this command`, ephemeral: true})
                }

                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) return await interaction.reply({ content: `There was no button code found for this button. `, ephemeral: true});

            try {
                await button.execute(interaction, client);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content: 'There was an error while executing this button.',
                    ephemeral: true
                });
            }
        }
    },
};