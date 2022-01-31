module.exports = {
    data: {
        name: `reaction-roles`
    },
    async execute (interaction, client) {
        await interaction.deferReply({ephermal: true});
        
        const rroleId = interaction.values[0];
        const rrole = interaction.guild.roles.cache.get(rroleId);
        const memberRoles = interaction.member.roles;
        const hasRole = memberRoles.cache.has(rroleId);

        if(hasRole) {
            memberRoles.remove(rroleId);
            interaction.followUp({content:`${rrole.name} has been removed from you`, ephermal: true})
        } else{
            memberRoles.add(rroleId)
            interaction.followup({content:`${rrole.name} has been added to you`, ephermal: true})
        }
    }
}