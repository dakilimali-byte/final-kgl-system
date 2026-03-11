
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    produceName: {
        type: String, required: true,
        match: [/^[a-zA-Z0-9\s]+$/, 'Produce name must be alphanumeric'],
        minlength: [2, 'Produce name must be at least 2 characters']
    },
    produceType: { type: String, required: true },
    tonnage: { type: Number, required: true },
    amountPaid: {
        type: Number, required: true,
        min: [10000, 'Amount must be at least 5 characters (10000+)']
    },
    buyerName: {
        type: String, required: true,
        match: [/^[a-zA-Z0-9\s]+$/, 'Buyer name must be alphanumeric'],
        minlength: [2, 'Buyer name must be at least 2 characters']
    },
    salesAgentName: {
        type: String, required: true,
        match: [/^[a-zA-Z0-9\s]+$/, 'Agent name must be alphanumeric'],
        minlength: [2, 'Agent name must be at least 2 characters']
    },
    branch: { type: String, required: true },
    
    // Tracking who actually typed it in (Agent or Manager)
    recordedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recordedByRole: { type: String, enum: ['agent', 'manager'], required: true },
    
    // Credit Sale Specific Fields
    isCredit: { type: Boolean, default: false },
    nationalId: { type: String }, 
    location: { type: String },
    contact: { type: String },
    dueDate: { type: Date },
    dateOfDispatch: { type: Date, default: Date.now }

}, { timestamps: true });

module.exports = mongoose.model('sale', saleSchema);