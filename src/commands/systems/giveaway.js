const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, CommandInteraction, Permissions} = require('discord.js');
const ms = require("ms");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('giveaway')
		.setDescription('Give something away')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('start a giveaway')
                    .addStringOption(option => option.setName('duration').setDescription('The duration of the giveaway (e.g 1m, 1h, 1d)')
                    .setRequired(true))
                    
                    .addIntegerOption(option => option.setName('winners').setDescription('The amount of winners')
                    .setRequired(true))

                    .addStringOption(option => option.setName('prize').setDescription('what is the prize of the giveaway')
                    .setRequired(true))

                    .addChannelOption(option => option.setName('channel').setDescription('select a channel to do the giveaway in (wont work in a vc lol)'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('actions')
                .setDescription('options for giveaways')
                    .addStringOption(option => option.setName('options').setDescription('Select an option')
                    .setRequired(true)
                        .addChoice('end', 'end')
                        .addChoice('pause', 'pause')
                        .addChoice('unpause', 'unpause')
                        .addChoice('reroll', 'reroll')
                        .addChoice('delete', 'delete'))
                    .addStringOption(option => option.setName('message-id').setDescription('Provide the id of the giveaway message')
                    .setRequired(true))
        ) 
        ,
    permissions: [ Permissions.FLAGS.ADMINISTRATOR], 
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */


execute(interaction, client) {
       const { options } = interaction;
       const Sub = options.getSubcommand();

       //embeds
       const errorEmbed = new MessageEmbed()
            .setColor("RED");

       const  sucessEmbed = new MessageEmbed()
            .setColor("GREEN");

        switch(Sub) {
            case "start" : {

                const gchannel = options.getChannel("channel") || interaction.channel;
                const duration = options.getString("duration");
                const winnerCount = options.getInteger("winners");
                const prize = options.getString("prize");

                client.giveawaysManager.start(gchannel, {
                    duration: ms(duration),
                    winnerCount,
                    prize,
                    messages : { 
                        giveaway: "🎉**GIVEAWAY STARTED**🎉",
                        giveawayEnded: "🎊**GIVEAWAY ENDED**🎊",
                        winMessage: '🎊🎉Congratulations, {winners}! You won **{this.prize}**!🎉🎊'
                    }
                }).then(async () => {
                   sucessEmbed.setDescription('Giveaway was sucessfully started.')
                   return interaction.reply({embeds: [sucessEmbed], ephemeral: true});
                }).catch((err) => {
                    errorEmbed.setDescription(`An error has occurred\n\`${err}\``)
                    return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                })

            }
            break;

            case "actions" : {
                const choise = options.getString("options")
                const messageId = options.getString("message-id");
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);

                // If no giveaway was found
                if (!giveaway) {
                    errorEmbed.setDescription("Unable to find the giveaway with the message id provided in this guild (${messageId})")
                    return interaction.reply({embeds: [errorEmbed], ephemeral: true});

                }

                switch(choise) {
                    case "end" : {
                        client.giveawaysManager.end(messageId).then(() => {
                            sucessEmbed.setDescription("Giveaway has been manually ended")
                            return interaction.reply({embeds: [sucessEmbed], ephemeral: true})
                        }).catch((err) => {
                            errorEmbed.setDescription(`An error has occurred\n\`${err}\``)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;

                    case "pause" : {
                        client.giveawaysManager.pause(messageId).then(() => {
                            sucessEmbed.setDescription("Giveaway has been paused")
                            return interaction.reply({embeds: [sucessEmbed], ephemeral: true})
                        }).catch((err) => {
                            errorEmbed.setDescription(`An error has occurred\n\`${err}\``)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;

                    case "unpause" : {
                        client.giveawaysManager.unpause(messageId).then(() => {
                            sucessEmbed.setDescription("Giveaway has been unpaused")
                            return interaction.reply({embeds: [sucessEmbed], ephemeral: true})
                        }).catch((err) => {
                            errorEmbed.setDescription(`An error has occurred\n\`${err}\``)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;

                    case "reroll" : {
                        client.giveawaysManager.reroll(messageId).then(() => {
                            sucessEmbed.setDescription("Giveaway has been rerolled")
                            return interaction.reply({embeds: [sucessEmbed], ephemeral: true})
                        }).catch((err) => {
                            errorEmbed.setDescription(`An error has occurred\n\`${err}\``)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;

                    case "delete" : {
                        client.giveawaysManager.delete(messageId).then(() => {
                            sucessEmbed.setDescription("Giveaway has been deleted")
                            return interaction.reply({embeds: [sucessEmbed], ephemeral: true})
                        }).catch((err) => {
                            errorEmbed.setDescription(`An error has occurred\n\`${err}\``)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;
                }
            }
            break;
            default : {
                console.log("error in giveawaycommand")
            }
        }
    },
};