const express = require('express');
const router = express.Router();

// Default Bloom's criteria templates
let criteriaStore = [
  {
    id: 1,
    name: 'Standard Academic (Default)',
    isDefault: true,
    bloomsDistribution: {
      Knowledge: 20,
      Understanding: 25,
      Application: 25,
      Analysis: 15,
      Evaluation: 10,
      Creation: 5
    },
    sections: [
      { name: 'Section A', questionType: 'mcq',       count: 10, marksEach: 1 },
      { name: 'Section B', questionType: 'short',      count: 5,  marksEach: 2 },
      { name: 'Section C', questionType: 'long',       count: 3,  marksEach: 10 }
    ]
  },
  {
    id: 2,
    name: 'Unit Test Template',
    isDefault: false,
    bloomsDistribution: {
      Knowledge: 30,
      Understanding: 30,
      Application: 20,
      Analysis: 10,
      Evaluation: 5,
      Creation: 5
    },
    sections: [
      { name: 'Section A', questionType: 'truefalse',  count: 5,  marksEach: 1 },
      { name: 'Section B', questionType: 'fillblank',  count: 5,  marksEach: 1 },
      { name: 'Section C', questionType: 'short',      count: 4,  marksEach: 3 }
    ]
  }
];
let nextId = 3;

// GET /api/criteria
router.get('/', (req, res) => {
  res.json({ success: true, criteria: criteriaStore });
});

// GET /api/criteria/:id
router.get('/:id', (req, res) => {
  const c = criteriaStore.find(x => x.id === parseInt(req.params.id));
  if (!c) return res.status(404).json({ error: 'Criteria template not found.' });
  res.json({ success: true, criteria: c });
});

// POST /api/criteria — create new template
router.post('/', (req, res) => {
  const c = { ...req.body, id: nextId++, createdAt: new Date().toISOString() };
  criteriaStore.push(c);
  res.json({ success: true, criteria: c });
});

// PUT /api/criteria/:id — update existing
router.put('/:id', (req, res) => {
  const idx = criteriaStore.findIndex(x => x.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Criteria template not found.' });
  criteriaStore[idx] = { ...criteriaStore[idx], ...req.body };
  res.json({ success: true, criteria: criteriaStore[idx] });
});

// DELETE /api/criteria/:id
router.delete('/:id', (req, res) => {
  const idx = criteriaStore.findIndex(x => x.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Criteria template not found.' });
  criteriaStore.splice(idx, 1);
  res.json({ success: true, message: 'Deleted.' });
});

module.exports = router;
