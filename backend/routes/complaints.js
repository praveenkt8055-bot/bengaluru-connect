const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const Complaint = require('../models/Complaint');
const FormData = require('form-data');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/complaints', upload.single('image'), async (req, res) => {
  try {
    const { name, description, locationName, latitude, longitude } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    let verifyResult = { match: true, confidenceScore: 100 };
    let category = "Unknown";
    let priority = "Medium";

    // Call the AI Service if image is provided
    if (req.file) {
      const filePath = req.file.path;
      const form = new FormData();
      form.append('description', description);
      form.append('image', fs.createReadStream(filePath));

      try {
        const aiResponse = await axios.post(process.env.AI_SERVICE_URL || 'http://localhost:8000/verify', form, {
          headers: {
            ...form.getHeaders()
          }
        });
        
        category = aiResponse.data.category;
        priority = aiResponse.data.priority;
        verifyResult = {
          match: aiResponse.data.verifyResult.match,
          confidenceScore: aiResponse.data.verifyResult.confidenceScore
        };
      } catch (aiError) {
        console.error("AI Service Error:", aiError.message);
        // Fallback or continue if AI fails
      }
    }

    const complaint = new Complaint({
      name,
      description,
      imageUrl,
      category,
      priority,
      locationName,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      verifyResult,
      status: 'Pending'
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
