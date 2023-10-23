const mongoose = require('mongoose');
const { patientProgressSchema, initialValue } = require("./patientProgress");

const patientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    typeOfPatient: {
        type: String,
        enum: ['transplant', 'non-transplant'],
        required: true,
        default: 'transplant'
    },
    patientUHID: {
        type: String,
        required: true,
        unique: true
    },
    donorUHID: String,
    nameOfAttendant: String,
    nameOfAttendant2: String,
    passportNumber: String,
    donorPassportNumber: String,
    attendantPassportNumber: String,
    attendant2PassportNumber: String,
    country: String,
    hospital: String,
    speciality: String,
    doctorDetails: String,
    visaIssueDate: String,
    dateofArrival: String,
    donorVisaExpireDate: String,
    donorVisaIssueDate: String,
    attendantVisaExpireDate: String,
    attendantVisaIssueDate: String,
    attendant2VisaExpireDate: String,
    attendant2VisaIssueDate: String,
    committeeDate: String,
    admissionDate: String,
    surgeryDate: String,
    dischargeDate: String,
    nameOfDonor: {
        type: String,
        default: 'none'
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
        enum: ['Pre-Work up', 'Surgery', 'Post Surgery', 'Post tx follow up updates', 'complete'],
        default: 'Pre-Work up'
    },
    extendingVisa: {
        type: Boolean,
        required: true,
        default: false
    }
});




module.exports = mongoose.model('Patients', patientSchema);
