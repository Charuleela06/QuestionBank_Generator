import React, { useState, useContext } from 'react';
import { ToastContext } from '../App';
import { exportQuestionPaperPDF, exportAnswerKeyPDF } from '../utils/pdfExport';

const BLOOMS_COLORS = {
  Knowledge: 'badge-knowledge', Understanding: 'badge-understanding',
  Application: 'badge-application', Analysis: 'badge-analysis',
  Evaluation: 'badge-evaluation', Creation: 'badge-creation',
};

const DIFF_COLORS = { Easy: 'var(--accent-green)', Medium: 'var(--accent-amber)', Hard: 'var(--accent-rose)' };

export default function QuestionPaperView({ paper, readOnly = false }) {
  const [showAnswers, setShowAnswers] = useState(false);
  const addToast = useContext(ToastContext);

  if (!paper) return null;

  const allQuestions = (paper.sections || []).flatMap(s => s.questions || []);
  const bloomsSummary = {};
  allQuestions.forEach(q => {
    bloomsSummary[q.cognitiveCategory] = (bloomsSummary[q.cognitiveCategory] || 0) + (q.marks || 0);
  });

  return (
    <div>
      {/* Paper header */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(167,139,250,0.08))' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          {paper.institution && <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 4 }}>{paper.institution}</p>}
          <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800 }}>{paper.paperTitle || paper.subject + ' Examination'}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: '0.9rem' }}>
            {paper.examType} &nbsp;·&nbsp; {paper.subject}
            {paper.topic && <span> &nbsp;·&nbsp; {paper.topic}</span>}
          </p>
        </div>
        <div className="stats-row" style={{ justifyContent: 'center' }}>
          <div className="stat-chip">📊 Total Marks: <strong>{paper.totalMarks}</strong></div>
          <div className="stat-chip">⏱ Duration: <strong>{paper.duration}</strong></div>
          <div className="stat-chip">🎯 Difficulty: <strong style={{ color: DIFF_COLORS[paper.difficulty] || 'inherit' }}>{paper.difficulty}</strong></div>
          <div className="stat-chip">❓ Questions: <strong>{allQuestions.length}</strong></div>
        </div>

        {/* Bloom's summary */}
        {Object.keys(bloomsSummary).length > 0 && (
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cognitive Level Coverage</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(bloomsSummary).map(([cat, marks]) => (
                <span key={cat} className={`badge ${BLOOMS_COLORS[cat] || ''}`}>{cat}: {marks}M</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button
            className={`btn btn-sm ${showAnswers ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => setShowAnswers(v => !v)}
          >
            {showAnswers ? '🙈 Hide Answers' : '🗝️ Show Answer Key'}
          </button>
          {!readOnly && (
            <>
              <button className="btn btn-sm btn-secondary" onClick={() => exportAnswerKeyPDF(paper)}>⬇ Answer Key PDF</button>
              <button className="btn btn-sm btn-primary" onClick={() => exportQuestionPaperPDF(paper)}>⬇ Question Paper PDF</button>
            </>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className={showAnswers ? 'answer-key-mode' : ''}>
        {(paper.sections || []).map((section, si) => (
          <div key={si}>
            <div className="section-header">
              <h3>{section.name}</h3>
              <span>{section.description || `${section.totalQuestions} Questions · ${section.totalMarks} Marks`}</span>
            </div>
            {(section.questions || []).map((q, qi) => (
              <div key={qi} className="question-card">
                <div className="question-card-header">
                  <span className="question-number">Q{q.questionNumber || qi + 1}</span>
                  <p className="question-text">{q.questionText}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>[{q.marks}M]</span>
                    {q.difficulty && (
                      <span style={{ fontSize: '0.7rem', color: DIFF_COLORS[q.difficulty] || 'inherit' }}>{q.difficulty}</span>
                    )}
                  </div>
                </div>

                {/* MCQ / TF Options */}
                {q.options && q.options.length > 0 && (
                  <div className="question-options">
                    {q.options.map((opt, oi) => {
                      const isCorrect = showAnswers && q.answer && opt.startsWith(q.answer.charAt(0));
                      return (
                        <div key={oi} className={`question-option ${isCorrect ? 'correct' : ''}`}>
                          {isCorrect && '✓ '}{opt}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Bloom's category badge */}
                <div className="question-meta">
                  {q.cognitiveCategory && (
                    <span className={`badge ${BLOOMS_COLORS[q.cognitiveCategory] || ''}`}>
                      🧠 {q.cognitiveCategory}
                    </span>
                  )}
                  {q.difficulty && (
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: DIFF_COLORS[q.difficulty] || 'inherit' }}>
                      {q.difficulty}
                    </span>
                  )}
                </div>

                {/* Answer + Reasoning (shown in answer mode) */}
                {showAnswers && (
                  <>
                    {q.answer && (
                      <div className="answer-block">
                        <strong>Answer:</strong> {q.answer}
                      </div>
                    )}
                    {q.categoryReasoning && (
                      <div className="reasoning-block">
                        💡 <em>Why {q.cognitiveCategory}?</em> — {q.categoryReasoning}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
