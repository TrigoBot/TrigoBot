const { model, Schema } = require("mongoose");

module.exports = model("tickets", new Schema({
    GuildID: String,
    ChannelID: String,
    ChannelName: String,
    UserID: String,
    Number: Number,
    Logs: {type: Array, default: []},
    Archived: {type: Boolean, default: false}
}));