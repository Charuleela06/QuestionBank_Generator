const mongoose = require('mongoose');

// Question schema embedded within a paper
const QuestionSchema = new mongoose.Schema({
  questionNumber: Number,
  questionText: { type: String, required: true },
  questionType: {
    type: String,
    enum: ['mcq', 'short', 'long', 'truefalse', 'fillblank'],
    required: true
  },
  marks: { type: Number, required: true },
  options: [String],            // For MCQ
  answer: { type: String },      // Answer key
  cognitiveCategory: {
    type: String,
    enum: ['Knowledge', 'Understanding', 'Application', 'Analysis', 'Evaluation', 'Creation'],
    required: true
  },
  categoryReasoning: { type: String }, // AI reasoning for the category tag
  section: String,               // e.g., "Section A"
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] }
});

const SectionSchema = new mongoose.Schema({
  name: String,                  // e.g., "Section A"
  description: String,           // e.g., "MCQ (10 × 1 = 10)"
  questionType: String,
  marksPerQuestion: Number,
  totalQuestions: Number,
  totalMarks: Number,
  questions: [QuestionSchema]
});

const PaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  topic: String,
  syllabus: String,
  examType: String,               // Unit Test / Semester Exam
  totalMarks: Number,
  duration: String,               // e.g., "3 Hours"
  difficulty: String,
  institution: String,
  sections: [SectionSchema],
  // Bloom's Taxonomy / criteria marks distribution used
  criteriaDistribution: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Paper', PaperSchema);
