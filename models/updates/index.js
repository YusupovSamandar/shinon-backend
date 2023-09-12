const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patients', // Reference to the Patient model
    },
    date: {
        type: Date,
        default: Date.now,
    },
    content: String, // The content of the update
    editor: String
});

updateSchema.index({ date: -1 });

module.exports = mongoose.model('Updates', updateSchema);