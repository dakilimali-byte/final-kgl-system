const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema({
    produceName: {
        type: String,
        required: true,
        match: [/^[a-zA-Z0-9\s]+$/, 'Produce name must be alphanumeric'] // 
    },
    produceType: {
        type: String,
        required: true,
        minlength: [2, 'Produce type must be at least 2 characters'], // 
        match: [/^[a-zA-Z\s]+$/, 'Produce type must contain alphabets only'] // 
    },
    dateOfIntake: {
        type: Date,
        required: true, // 
        default: Date.now
    },
    tonnage: {
        type: Number,
        required: true,
        min: [100, 'Tonnage must be at least 3 characters (100+)'] // Numeric representation of "not less than 3 characters" 
    },
    cost: {
        type: Number,
        required: true,
     
    },
    dealerName: {
        type: String,
        required: true,
        minlength: [2, 'Dealer name must be at least 2 characters'], // 
        match: [/^[a-zA-Z0-9\s]+$/, 'Dealer name must be alphanumeric'] // 
    },
    contact: {
        type: String,
        required: true,
        match: [/^\+?[0-9\s\-]+$/, 'Must be a valid phone number'] // 
    },
    sourceType: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true 
    },
    sellingPrice: {
        type: Number,
        required: true 
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // To track which manager recorded this
    }
}, { timestamps: true });

module.exports = mongoose.model('procurement', procurementSchema);