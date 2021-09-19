const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({

    id: String,
    name: String,

});

module.exports = mongoose.model('Blacklist', blacklistSchema);