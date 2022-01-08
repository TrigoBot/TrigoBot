module.exports = {
    name: 'err',
    async execute(error) {
        console.log('\x1b[31m%s\x1b[0m', error);
    },
};