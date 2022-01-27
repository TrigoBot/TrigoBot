const { model, Schema } = require("mongoose");

module.exports = model("guilds", new Schema({
    GuildID: String,
    TEnabled: {type: String, default: "false"},
    TCategory: {type: String},
    TRole: {type: String},
    TNumber: {type: Number},
    TLog: {type: Boolean, default: false},
    RankCard: {
        InnerRing: {type: String, default: ""},
        OuterRing: {type: String, default: ""},
        ProgressBar: {type: String, default: "#77b7e6"},
        BackgroundType: {type: String, default: "COLOR"},
        BackgroundData: {type: String, default: "#222222"}
    },
}));