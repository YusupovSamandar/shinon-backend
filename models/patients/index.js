const mongoose = require('mongoose');
const { patientProgressSchema, initialValue } = require("./patientProgress");

const patientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    nameOfDonor: {
        type: String,
        required: true
    },
    patientPicture: String,
    patientPassport: String,
    dateOfVisaExpiry: {
        type: Date,
        required: true
    },
    returnTicket: {
        type: String,
        default: 'none'
    },
    patientProgress: {
        type: patientProgressSchema,
        default: initialValue
    },
    currentStatus: {
        type: String,
        enum: ['Pre-Work up', 'Surgery', 'Post Surgery', 'Post tx follow up updates'],
        default: 'Pre-Work up'
    }
});




module.exports = mongoose.model('Patients', patientSchema);
