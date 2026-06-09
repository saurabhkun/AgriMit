require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Init Middleware
app.use(express.json());
app.use(cors());

// Connect DB (Using in-memory MongoDB or local mongo for dev if no URI)
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agrimit_db';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/predict', require('./routes/predict'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
