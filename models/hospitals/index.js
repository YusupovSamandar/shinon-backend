const mongoose = require('mongoose');

const hospitalsSchema = new mongoose.Schema({
    hospitalName: {
        type: String,
        required: true,
        unique: true
    },
    desc: String
});

module.exports = mongoose.model('Hospitals', hospitalsSchema);
