const { model, Schema } = require("mongoose");

module.exports = model("SuggestDB", new Schema({
    GuildID: String,
    MessageID: String,
    SuggestID: String,
    Details: Array,
    Status: String,
}));