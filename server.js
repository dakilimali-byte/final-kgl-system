const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// ==========================================
// 1. MIDDLEWARE
// ==========================================
// ⚠️ SECURITY NOTE: Currently allowing all origins. 
// Once your frontend is permanently hosted, change this to:
// app.use(cors({ origin: 'https://your-frontend-url.vercel.app' }));
app.use(cors()); 
app.use(express.json()); 

// ==========================================
// 2. HEALTH CHECK ROUTE (For Render)
// ==========================================
// Go to https://your-render-url.onrender.com/ to see this in your browser!
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "UP", 
    message: "✅ Karibu Groceries API is LIVE and running on Render!" 
  });
});

const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const salesRoutes = require('./routes/salesRoutes'); 
const logsRoutes = require('./routes/logs');

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/logs', logsRoutes);

const PORT = process.env.PORT || 3000;

if (!process.env.MONGO_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is missing from environment variables.");
  process.exit(1); // Force the server to crash so Render alerts you
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ KGL Database is LIVE on MongoDB Atlas');
    
    // Only start the server IF the database connects successfully
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MONGODB CONNECTION ERROR:', err.message);
    process.exit(1); // Kill the server if DB fails, preventing silent "zombie" servers
  });
