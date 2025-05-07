require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const complaintRoutes = require('./routes/complaints');
const authRoutes = require('./routes/auth');

const dotenv = require('dotenv');
const connectDB = require('./config/db');
//mport Routes
const auth = require('./routes/auth');
const complaint = require('./routes/complaints');
const adminRoutes = require('./routes/adminRoutes');


dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/complaints', complaint);
app.use('/api/admin', adminRoutes);
app.use('/api', adminRoutes); // Adjust the path as needed

app.use('/', (req, res) => {
  res.send('API is running...');
});
// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://crime-portal-ws0j.onrender.com'], // Add both development and production frontend URLs
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies if needed
}));
app.options('*', cors()); // Handle preflight requests
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Routes


// Start Server

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));