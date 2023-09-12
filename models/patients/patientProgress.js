const mongoose = require('mongoose');
let initialValue = {
    preWorkup: {
        complete: false,
        details: [
            {
                analysis: "Blood Tests",
                done: false
            },
            {
                analysis: "HBV DNA Quantitive",
                done: false
            },
            {
                analysis: "Hepatisis B Core antibodies",
                done: false
            },
            {
                analysis: "CT scan",
                done: false
            },
            {
                analysis: "Calcium scoring",
                done: false
            },
            {
                analysis: "USG pelvis",
                done: false
            },
            {
                analysis: "USG abdomen",
                done: false
            }
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

module.exports = {
    patientProgressSchema,
    initialValue
}
