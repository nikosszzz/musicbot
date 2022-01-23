const
    mongoose = require('mongoose'),
    blacklistSchema = new mongoose.Schema({

    id: String,
    name: String,

});

module.exports = mongoose.model('Blacklist', blacklistSchema);