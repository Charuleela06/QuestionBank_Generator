const mongoose = require('mongoose');

const CriteriaSchema = new mongoose.Schema({
  name: { type: String, required: true },  // e.g., "Default Template"
  subject: String,
  bloomsDistribution: {
    Knowledge:      { type: Number, default: 20 },  // % of marks
    Understanding:  { type: Number, default: 25 },
    Application:    { type: Number, default: 25 },
    Analysis:       { type: Number, default: 15 },
    Evaluation:     { type: Number, default: 10 },
    Creation:       { type: Number, default: 5  }
  },
  sections: [
    {
      name: String,
      questionType: { type: String, enum: ['mcq', 'short', 'long', 'truefalse', 'fillblank'] },
      count: Number,
      marksEach: Number
    }
  ],
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Criteria', CriteriaSchema);
