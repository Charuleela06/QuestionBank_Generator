import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🤖', title: 'Gemini AI Powered', desc: 'Leverages Google Gemini 1.5 Flash to generate high-quality, curriculum-aligned questions instantly.' },
  { icon: '🧠', title: "Bloom's Taxonomy Tags", desc: "Every question is tagged with a cognitive level (Knowledge, Understanding, Application, Analysis, Evaluation, Creation) with AI reasoning." },
  { icon: '📊', title: 'Configurable Criteria', desc: 'Set exact mark distributions per cognitive level and define custom section structures for each exam type.' },
  { icon: '🗝️', title: 'Answer Key Generation', desc: 'Automatically generates a complete answer key alongside the question paper for teacher reference.' },
  { icon: '📑', title: 'PDF Export', desc: 'Download professionally formatted Question Paper and Answer Key PDFs ready for printing.' },
  { icon: '💾', title: 'Paper Bank', desc: 'Save and manage all generated question papers in a built-in paper bank for future reference.' },
];

export default function HomePage() {
  return (
    <div>
      <div className="container">
        <section className="hero">
          <div className="hero-title">
            Generate Exam Papers<br />
            with <span className="gradient-text">Gemini AI</span>
          </div>
          <p className="hero-sub">
            Instantly create structured, curriculum-aligned question papers with answer keys,
            Bloom's Taxonomy cognitive tags, and professional PDF export — in seconds.
          </p>
          <div className="hero-actions">
            <Link to="/generate" className="btn btn-primary btn-lg">✨ Generate Paper</Link>
            <Link to="/criteria" className="btn btn-secondary btn-lg">⚙️ Configure Criteria</Link>
          </div>
        </section>

        <hr className="section-divider" />

        <section>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
            Everything You Need
          </h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 0 }}>
            A complete AI-powered exam generation suite for educators
          </p>
          <div className="feature-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: '40px 0 64px', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: 700, margin: '0 auto', padding: '40px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🚀</div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 700, marginBottom: 10 }}>Ready to get started?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Make sure to add your Gemini API key in <code style={{ background: 'rgba(108,99,255,0.12)', padding: '2px 8px', borderRadius: 5, fontSize: '0.88rem', color: 'var(--accent-secondary)' }}>backend/.env</code> before generating.
            </p>
            <Link to="/generate" className="btn btn-primary btn-lg">Start Generating →</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
