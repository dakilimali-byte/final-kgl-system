const express = require('express');
const router = express.Router();
const { recordProcurement, getBranchInventory, updatePrice } = require('../controllers/inventoryController'); 

// Route to submit new procurement
router.post('/procure', recordProcurement);

// Route to get inventory records
router.get('/stock', getBranchInventory);


// <--- Ensure updatePrice is imported here!

router.patch('/update-price/:id', updatePrice); 


module.exports = router;