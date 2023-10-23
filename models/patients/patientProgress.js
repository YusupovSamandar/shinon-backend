const mongoose = require('mongoose');
let initialValue = {
    preWorkup: {
        complete: false,
        details: [
            {
                analysis: "Blood Group",
                done: false
            },
            {
                analysis: "LP I (3939)",
                done: false
            },
            {
                analysis: "HIV I & II",
                done: false
            },
            {
                analysis: "CMV IgG",
                done: false
            },
            {
                analysis: "HbsAg | HCV Ab",
                done: false
            },
            {
                analysis: "Thyroid Profile",
                done: false
            },
            {
                analysis: "Tumor Markers",
                done: false
            },
            {
                analysis: "Urine Analysis",
                done: false
            },
            {
                analysis: "Blood Culture Sensitivity",
                done: false
            },
            {
                analysis: "2D Echo with PA Pressure",
                done: false
            },
            {
                analysis: "Finger Prick FBS | HBA1C",
                done: false
            },
            {
                analysis: "SpO2 @RA | Bubble Contrast Echo",
                done: false
            },
            {
                analysis: "CT Angiogram Liver | US Liver Doppler",
                done: false
            },
            {
                analysis: "UGI Endoscopy",
                done: false
            },
            {
                analysis: "ENT Clearance",
                done: false
            },
            {
                analysis: "UPT",
                done: false
            },
            {
                analysis: "USG Pelvis",
                done: false
            },
            {
                analysis: "USG B/L Breast",
                done: false
            },
            {
                analysis: "PAP Smear",
                done: false
            },
        ],
    },
    surgery: {
        complete: false,
        details: []
    },
    postSurgery: {
        complete: false,
        details: []
    },
    postTxFollowUp: {
        complete: false,
        details: [],
    }
}

const analysisDetailSchema = new mongoose.Schema({
    analysis: String,
    done: Boolean,
});

const patientProgressSchema = new mongoose.Schema({
    preWorkup: {
        complete: Boolean,
        details: [analysisDetailSchema], // Use the AnalysisDetail schema here
    },
    surgery: {
        complete: Boolean,
        details: [analysisDetailSchema],
    },
    postSurgery: {
        complete: Boolean,
        details: [analysisDetailSchema],
    },
    postTxFollowUp: {
        complete: Boolean,
        details: [analysisDetailSchema],
    },
});

const nonTransplantValue = {
    preWorkup: {
        complete: false,
        details: []
    },
    surgery: {
        complete: false,
        details: []
    },
    postSurgery: {
        complete: false,
        details: []
    },
    postTxFollowUp: {
        complete: false,
        details: [],
    }
}

module.exports = {
    patientProgressSchema,
    initialValue,
    nonTransplantValue
}
