
const express = require('express');
const router = express.Router();
const { recordSale, getSales } = require('../controllers/salesController');
const Sale = require('../models/sale');

// POST /api/sales - Create a new sale
router.post('/', recordSale);

// GET /api/sales - Get sales history
router.get('/', getSales);

// Route to mark a credit sale as paid
router.put('/pay/:id', async (req, res) => {
    try {
        const saleId = req.params.id;
        
        // Find the sale and update isCredit to false
        const updatedSale = await Sale.findByIdAndUpdate(
            saleId, 
            { isCredit: false }, 
            { new: true } // Returns the updated document
        );

        if (!updatedSale) {
            return res.status(404).json({ success: false, message: 'Sale not found' });
        }

        res.json({ success: true, message: 'Sale marked as paid', data: updatedSale });
    } catch (error) {
        console.error("Payment update error:", error);
        res.status(500).json({ success: false, message: 'Server error updating payment' });
    }
});



module.exports = router;