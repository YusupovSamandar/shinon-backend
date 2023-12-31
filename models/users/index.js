const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: String,
    hospital: {
        type: String,
        default: 'FHN',
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'viewer', 'interpreter', 'developer'],
        required: true
    }
});

module.exports = mongoose.model('Users', usersSchema);
