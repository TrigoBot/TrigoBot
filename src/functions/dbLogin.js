const mongoose = require("mongoose");
const fs = require("fs");
const mongoEventFiles = fs.readdirSync("./src/mongoEvents").filter(file => file.endsWith(".js"));

module.exports = (client => {
    client.dbLogin = async () => {
        for (file of mongoEventFiles) {
            const event = require(`../mongoEvents/${file}`);
            if (event.once) {
                mongoose.connection.once(event.name, (...args) => event.execute(...args));
            } else {
                mongoose.connection.on(event.name, (...args) => event.execute(...args));
            }
        }
        mongoose.Promise = global.Promise;
        const dbOptions = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            //dbName: process.env.DBNAME,
        }


        if (!process.env.DBURL) return console.log('\x1b[31m%s\x1b[0m', "Must specify DBURL in .env")

        if (!process.env.DBUSER) {
            await mongoose.connect("mongodb://"+process.env.DBURL, dbOptions);
            client.levels.setURL("mongodb://"+process.env.DBURL)
        } else {
            if (!process.env.DBPASS) return console.log('\x1b[31m%s\x1b[0m', "Must specify DBPASS in .env")
            if (!process.env.DBAUTHSOURCE) {
                let authSource = 'admin'
                await mongoose.connect(`mongodb://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBURL}?authSource=${authSource}`, dbOptions)
                client.levels.setURL(`mongodb://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBURL}?authSource=${authSource}`)
            } else {
                await mongoose.connect(`mongodb://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBURL}?authSource=${process.env.DBAUTHSOURCE}`, dbOptions)
                client.levels.setURL(`mongodb://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBURL}?authSource=${process.env.DBAUTHSOURCE}`)
            }            
        }
    };
})