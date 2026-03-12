const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors(
  {
    origin: "kgl-software.netlify.app"
  }
)); 
app.use(express.json()); 

// Import Routes
const authRoutes = require('./routes/authRoutes');

// Use Routes 
app.use('/api/auth', authRoutes);



// Import the inventory-routes
const inventoryRoutes = require('./routes/inventoryRoutes');

// Mount the routes
app.use('/api/inventory', inventoryRoutes);

// Import the route at the top/middle with your other imports
const salesRoutes = require('./routes/salesRoutes'); 

// Mount it to the /api/sales URL path
app.use('/api/sales', salesRoutes);

app.use('/api/logs', require('./routes/logs'));

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));