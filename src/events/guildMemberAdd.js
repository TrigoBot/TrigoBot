const guildSchema = require('../models/guildSchema');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member, client) {
        let guildProfile = await guildSchema.findOne({ GuildID: member.guild.id })
        if (!guildProfile) {
            guildProfile = await new guildSchema({
                GuildID: member.guild.id
            });
            await guildProfile.save().catch(err => console.log(err));
        }

        if (guildProfile.NRole) {
            member.roles.add(guildProfile.NRole, "Auto roles")
        }
    },
};