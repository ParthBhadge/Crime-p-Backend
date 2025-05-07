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
const app = express();

app.use(cors({
  origin: 'https://crime-portal-ws0j.onrender.com/',  // Allow both development and production origins

}));

dotenv.config();
connectDB();
app.use(express.json());

app.use((req, res, next) => {
  res.removeHeader('Cross-Origin-Opener-Policy');
  res.removeHeader('Cross-Origin-Embedder-Policy');
  next();
});

app.use('/api/auth', auth);
app.use('/api/complaints', complaint);
app.use('/api/admin', adminRoutes);
app.use('/api', adminRoutes); // Adjust the path as needed

app.use('/', (req, res) => {
  res.send('API is running...');
});
// Middleware

// Handle preflight requests
// app.options('*', cors());

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
//new 2


// Start Server

const PORT = process.env.PORT || 5001; // Use the PORT environment variable or default to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));