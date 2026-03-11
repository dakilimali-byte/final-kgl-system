
const Sale = require('../models/sale');
const Inventory = require('../models/inventory');

// 1. Record a new sale and deduct stock
exports.recordSale = async (req, res) => {
    try {
        const saleData = req.body;

        // Step A: Find the inventory item for this specific branch
        const inventoryItem = await Inventory.findOne({ 
            produceName: saleData.produceName, 
            branch: saleData.branch 
        });

        // Step B: Business Rule Check - Is it in stock?
        if (!inventoryItem) {
            return res.status(400).json({ success: false, error: 'Produce not found in branch inventory.' });
        }

        if (inventoryItem.currentTonnage < saleData.tonnage) {
            return res.status(400).json({ 
                success: false, 
                error: `Insufficient stock! Only ${inventoryItem.currentTonnage} KG available.` 
            });
        }

        // Step C: Deduct the tonnage from inventory
        inventoryItem.currentTonnage -= saleData.tonnage;
        await inventoryItem.save();

        // Step D: Save the Sale record
        const newSale = new Sale(saleData);
        await newSale.save();

        res.status(201).json({ success: true, message: 'Sale recorded and inventory updated.', data: newSale });

    } catch (error) {
        console.error("Sale Error: ", error);
        // Handle Mongoose validation errors nicely
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};



// 2. Fetch Sales (Smart filtering for Managers vs Agents)
exports.getSales = async (req, res) => {
    try {
        const { branch, agentId } = req.query;
        let query = {};

        // If an agent asks, only give them their sales
        if (agentId) {
            query.recordedById = agentId;
        } 
        // If a manager asks, give them all sales for their branch
        else if (branch) {
            query.branch = branch;
        }

        const sales = await Sale.find(query).sort({ createdAt: -1 }); // Newest first
        res.status(200).json({ success: true, count: sales.length, data: sales });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};