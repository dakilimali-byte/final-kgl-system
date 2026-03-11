const Procurement = require('../models/procurement');
const Inventory = require('../models/inventory');

exports.recordProcurement = async (req, res) => {
    try {
        // 1. Extract data from the incoming request body
        const { 
            produceName, produceType, tonnage, cost, dealerName, 
            contact, sourceType, branch, sellingPrice 
        } = req.body;

        // Note: We will eventually get the managerId from the logged-in user's token
        // For now, we'll assume it's passed in the body or mocked
        const managerId = req.user ? req.user.id : "64f1b2c3e4d5a6b7c8d9e0f1"; // Replace mock once auth is linked

        // 2. Create the procurement record
        const newProcurement = new Procurement({
            produceName, produceType, tonnage, cost, dealerName, 
            contact, sourceType, branch, sellingPrice, managerId
        });
        await newProcurement.save();

        // 3. Update or Create the Inventory Record for that specific branch
        let inventoryItem = await Inventory.findOne({ produceName, branch });
    
        
        if (inventoryItem) {
            inventoryItem.currentTonnage += Number(tonnage);
            inventoryItem.sellingPrice = Number(sellingPrice);
            inventoryItem.supplierName = dealerName; 
            inventoryItem.supplierContact = contact; 
            inventoryItem.cost = Number(cost); 
            await inventoryItem.save();
        } else {
            inventoryItem = new Inventory({
                produceName, produceType, branch, 
                currentTonnage: Number(tonnage), 
                sellingPrice: Number(sellingPrice),
                supplierName: dealerName,
                supplierContact: contact,
                cost: Number(cost)
            });
            await inventoryItem.save();
        }

        res.status(201).json({ 
            success: true, 
            message: 'Procurement recorded and inventory updated successfully!',
            procurement: newProcurement
        });

    } catch (error) {
        console.error("Procurement Error: ", error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// Function to fetch inventory for the frontend table
exports.getBranchInventory = async (req, res) => {
    try {
        const branch = req.query.branch; // We will pass the manager's branch as a query
        const query = branch ? { branch: branch } : {}; // If no branch provided, get all (for Director)
        
        const inventory = await Inventory.find(query);
        res.status(200).json({ success: true, count: inventory.length, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Function to update the selling price of an inventory item
exports.updatePrice = async (req, res) => {
    try {
        const { id } = req.params; // The MongoDB ID of the item
        const { newPrice } = req.body; // The new price from the frontend

        if (!newPrice || newPrice <= 0) {
            return res.status(400).json({ success: false, error: 'A valid price is required' });
        }

        // Find the item by ID and update its sellingPrice
        const updatedItem = await Inventory.findByIdAndUpdate(
            id,
            { sellingPrice: Number(newPrice) },
            { new: true } // This returns the updated document
        );

        if (!updatedItem) {
            return res.status(404).json({ success: false, error: 'Inventory item not found' });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Price updated successfully', 
            data: updatedItem 
        });

    } catch (error) {
        console.error("Update Price Error: ", error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};