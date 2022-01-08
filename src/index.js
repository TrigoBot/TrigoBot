const { Client, Intents, Collection } = require('discord.js');
const DisTube = require('distube');
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { SpotifyPlugin } = require('@distube/spotify')
const fs = require('fs');
require('dotenv').config();

const intents = new Intents(641);
const client = new Client({ intents });

const distube = new DisTube.default(client, {
    searchSongs: 1,
    searchCooldown: 30,
    leaveOnEmpty: true,
    emptyCooldown: 0,
    leaveOnFinish: true,
    leaveOnStop: true,
    youtubeCookie: "LOGIN_INFO=AFmmF2swRQIhANHWCjefL7oJrNLZVMXhF8nE3dlA2mI4rZS9WAR4BR93AiARSPv2hIMJbtFNNjg7WqEiTp2h64QgZBHLuLu-ue8XIQ:QUQ3MjNmd0FEZ2VMSUZwQnozeUxadXBYb2N1SHQzOXNtdzhNOU5mbWJ4bWN4c3EzVzEzNm9xTHFYaFdQOU55b2NITU1HUk1oQ3hlSlh0XzR2SW94bzE2MmZOVnBhZGtNY0pWZXh1OFI5b1BhT1BIZndlRE52bVZzTWNSaTZNLVY3ckVMSi1aSVBLb19QTHFWVVItR25tVXNsMkFMeXpsV3dn; VISITOR_INFO1_LIVE=IPKicBnVAXo; PREF=tz=Europe.Amsterdam&f6=40000000; HSID=Ah-hp1FTnNcUTPORA; SSID=ATXvDyGBJaWCVpuS2; APISID=lxQgrsK1_YHK8vAR/AQjapf1j86p5l8XNB; SAPISID=B0-PKYnu1mNZS90j/AeAyyKfxlV110LmZY; __Secure-1PAPISID=B0-PKYnu1mNZS90j/AeAyyKfxlV110LmZY; __Secure-3PAPISID=B0-PKYnu1mNZS90j/AeAyyKfxlV110LmZY; SID=FAixObJZ8fY292fhNkkgq4UkTz-jxIQ4lAlw1ZR2Uy7WR9NX0sKjhAnQDU1HgyDJD-k2rQ.; __Secure-1PSID=FAixObJZ8fY292fhNkkgq4UkTz-jxIQ4lAlw1ZR2Uy7WR9NXheMvttjfdRiNxKbv3dCU1w.; __Secure-3PSID=FAixObJZ8fY292fhNkkgq4UkTz-jxIQ4lAlw1ZR2Uy7WR9NXio6LuJZRSbVrnj5KxwjUaQ.; YSC=hXjbvSR2IlI; SIDCC=AJi4QfEiZyI-w2fvzn1Ke7FN2LZ8hc99TxYeqTkiOvwCQfhe3qY9LXUN_sOWGDZOnlczQTLDWAE; __Secure-3PSIDCC=AJi4QfHoV2pFS74oxt5HXVP-3oFypw-29RSGVOEMODejFxetMlmCnbwGci8NtplEg1H7Txuh1Z8",
    plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
});
client.distube = distube

client.commands = new Collection();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    console.log('\x1b[35m%s\x1b[0m', 'Loaded events')
    client.handleCommands(commandFolders, "./src/commands")
    client.handleMusic(client)
    console.log('\x1b[35m%s\x1b[0m', 'Loaded Distube')
    client.login(process.env.TOKEN);

    client.dbLogin();

})();
