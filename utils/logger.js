const Log = require('../models/log');

async function logActivity(user, role, branch, action, details) {
    try {
        const newLog = new Log({ user, role, branch, action, details });
        await newLog.save();
    } catch (err) {
        console.error("Failed to save log:", err);
    }
}

module.exports = logActivity;