const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const auth = require('../middleware/authMiddleware');
const Prediction = require('../models/Prediction');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const mlApiUrl = process.env.ML_API_URL || 'http://localhost:8000/v1/analyze';

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Call FastAPI ML Service
    const response = await axios.post(mlApiUrl, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    const mlData = response.data;
    
    if (mlData.status === 'success' || mlData.status === 'low_confidence') {
        const isSuccess = mlData.status === 'success';
        const pred = mlData.prediction || {};
        
        const prediction = new Prediction({
          userId: req.user.id,
          crop: pred.crop || 'Unknown',
          disease: pred.disease || 'Unknown',
          confidence: pred.confidence || 0,
          severity: pred.severity || 'Unknown',
          recommendation: mlData.recovery_plan || mlData.message || 'No recommendation provided',
          imageUrl: req.file.originalname
        });
    
        await prediction.save();
    
        return res.json({
          status: mlData.status,
          prediction: prediction,
          metadata: mlData.metadata,
          message: mlData.message
        });
    }

    return res.status(400).json({ message: mlData.message || 'Error processing image' });

  } catch (error) {
    console.error(error.message);
    // If the error comes from the ML backend, proxy it
    if (error.response && error.response.data) {
       return res.status(500).json({ message: 'ML Backend Error', details: error.response.data });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
