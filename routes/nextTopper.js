const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const loadContent = () => {
  const filePath = path.join(__dirname, '..', '..', 'content.json');
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return {};
};

router.get('/', (req, res) => {
  res.send('Next Topper Main Page');
});

// Dynamic routes for math
router.get('/math/:topic', (req, res) => {
  const data = loadContent();
  const topic = req.params.topic;
  const content = data.math?.[topic] || [];
  res.render(`nextTopper/math/${topic}`, { content });
});

// Dynamic routes for science
router.get('views/next topper/science/:topic', (req, res) => {
  const data = loadContent();
  const topic = req.params.topic;
  const content = data.science?.[topic] || [];
  res.render(`nextTopper/science/${topic}`, { content });
});

// Dynamic routes for s_st
router.get('/s_st/:topic', (req, res) => {
  const data = loadContent();
  const topic = req.params.topic;
  const content = data.s_st?.[topic] || [];
  res.render(`nextTopper/s_st/${topic}`, { content });
});

module.exports = router;
