const fs = require("fs");
const musicEventFiles = fs.readdirSync("./src/musicEvents").filter(file => file.endsWith(".js"));

module.exports = (client) => {
    client.handleMusic = async(client) => {
        for (file of musicEventFiles) {
            const event = require(`../musicEvents/${file}`);
            if (event.once) {
                client.distube.once(event.name, (...args) => event.execute(...args));
            } else {
                client.distube.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
}