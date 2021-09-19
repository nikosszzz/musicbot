const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({

    GuildID: String,
    Prefix: String,

});

module.exports = mongoose.model('Guild', guildSchema);