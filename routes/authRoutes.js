const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// --- 1. REGISTRATION (POST) ---
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role, branch } = req.body;

        // Simple validation
        if (!username || !email || !password || !role || !branch  ) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already registered" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            branch
        });

        await newUser.save();
        console.log("User saved successfully!");
        res.status(201).json({ success: true, message: "Staff member registered!" });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Database Error: " + err.message });
    }
});
// --- 2. LOGIN (POST) ---
router.post('/login', async (req, res) => {
    try {
        const { username, password, role, branch } = req.body;

        if (!username || !password || !role || !branch) {
            return res.status(400).json({ message: 'Please provide username, password, role, and branch.' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found in the system.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        const dbRole = (user.role || '').trim().toLowerCase();
        const inputRole = (role || '').trim().toLowerCase().replace('_', ' ');
        
        const dbBranch = (user.branch || '').trim().toLowerCase();
        const inputBranch = (branch || '').trim().toLowerCase();

        // STRICT ROLE CHECK 
        if (dbRole !== inputRole) {
        
            return res.status(403).json({ 
                message: `Access Denied: You do not have ${user.role} privileges.` 
            });
        }

        // STRICT BRANCH CHECK
        if (dbBranch !== inputBranch) {
            return res.status(403).json({ 
                message: `Access Denied: You are not registered under the ${branch} branch.` 
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, branch: user.branch }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );



        // --- ADD THIS TO TRIGGER THE LOGIN ALERT ---
        const logActivity = require('../utils/logger'); // At the top of the file or here
        await logActivity(
            user.username, 
            user.role, 
            user.branch, 
            "System Login", 
            `${user.username} logged into the system.`
        );

        res.status(200).json({ 
            token, 
            user: { 
                username: user.username, 
                role: user.role,
                branch: user.branch 
            } 
        });

    } catch (error) {
        console.error("Login Route Error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- GET ALL USERS (For Admin Table) ---
router.get('/users', async (req, res) => {
    try {
        
        const users = await User.find({}, '-password'); 
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching staff:", err);
        res.status(500).json({ message: "Unable to load staff from database." });
    }
});
// GET A SINGLE USER BY ID (Add this to your auth.js)
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error retrieving user" });
    }
});

// UPDATE USER (Ensure this PUT route exists)
router.put('/users/:id', async (req, res) => {
    try {
        const { username, email, role, branch } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, role, branch },
            { new: true }
        );
        res.json({ message: "User updated successfully", updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});
// DELETE USER
router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: "Failed to delete user" });
    }
});


module.exports = router;