module.exports = {
    name: 'disconnected',
    async execute() {
        console.log('\x1b[31m%s\x1b[0m', "Disconnected from database.");
    },
};