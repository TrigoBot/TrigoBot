const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const guildSchema = require('../../models/guildSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Configure the bot.')
		.addSubcommand(subcommand =>
            subcommand
                .setName('autoroles')
                .setDescription('Set role')
                    .addRoleOption(role => role.setName('role').setDescription('Roles'))
		),

	permissions: [ Permissions.FLAGS.ADMINISTRATOR ],
	async execute(interaction, client) {
		const Sub = interaction.options.getSubcommand();
        
        let guildProfile = await guildSchema.findOne({ GuildID: interaction.guild.id })
        if (!guildProfile) {
            guildProfile = await new guildSchema({
                GuildID: interaction.guild.id
            })
            await guildProfile.save().catch(err => console.log(err));
        }

		switch(Sub) {
			case "autoroles" : {
				const role = interaction.options.getRole("role")
				if (role) {
					await guildSchema.findOneAndUpdate({ GuildID: interaction.guild.id}, {
						NRole: role.id,
					})
					await interaction.reply({ content: `Set the Auto role to <@&${role.id}>`, ephemeral: true});
				} else {
					await guildSchema.findOneAndUpdate({ GuildID: interaction.guild.id}, {
						NRole: "",
					})
					await interaction.reply({ content: `Disabled auto role, Specify role to enable`, ephemeral: true});
				}
			}
		}
	},
};
