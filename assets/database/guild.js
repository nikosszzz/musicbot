const
    mongoose = require('mongoose'),
    guildSchema = new mongoose.Schema({

    GuildID: String,
    Prefix: String,

});

module.exports = mongoose.model('Guild', guildSchema);