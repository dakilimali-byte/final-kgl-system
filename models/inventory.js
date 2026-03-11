const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    produceName: { type: String, required: true },
    produceType: { type: String, required: true },
    branch: { type: String, required: true, enum: ['Matugga', 'Maganjo']},
    currentTonnage: { type: Number, required: true, default: 0 },
    sellingPrice: { type: Number, required: true }, // Manager sets this [cite: 22]
    supplierName: { type: String },
    supplierContact: { type: String },
    supplierName: { type: String, default: 'Multiple Suppliers' },
    supplierContact: { type: String, default: 'No Contact' },
    cost: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('inventory', inventorySchema);