const express = require('express');
const router = express.Router();

// In-memory store (used when MongoDB is not configured)
let papers = [];
let idCounter = 1;

// GET /api/papers — list all saved papers
router.get('/', (req, res) => {
  res.json({ success: true, papers: papers.map(p => ({
    id: p.id,
    paperTitle: p.paperTitle,
    subject: p.subject,
    examType: p.examType,
    totalMarks: p.totalMarks,
    createdAt: p.createdAt
  }))});
});

// GET /api/papers/:id — get one paper
router.get('/:id', (req, res) => {
  const paper = papers.find(p => p.id === parseInt(req.params.id));
  if (!paper) return res.status(404).json({ error: 'Paper not found.' });
  res.json({ success: true, paper });
});

// POST /api/papers — save a paper
router.post('/', (req, res) => {
  const paper = { ...req.body, id: idCounter++, savedAt: new Date().toISOString() };
  papers.push(paper);
  res.json({ success: true, paper });
});

// DELETE /api/papers/:id
router.delete('/:id', (req, res) => {
  const idx = papers.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Paper not found.' });
  papers.splice(idx, 1);
  res.json({ success: true, message: 'Paper deleted.' });
});

module.exports = router;
