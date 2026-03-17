import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BLOOMS_COLORS = {
  Knowledge: [56, 189, 248],
  Understanding: [52, 211, 153],
  Application: [167, 139, 250],
  Analysis: [251, 191, 36],
  Evaluation: [248, 113, 113],
  Creation: [108, 99, 255],
};

function addHeader(doc, paper, pageWidth, isAnswerKey = false) {
  // Purple gradient bar at top
  doc.setFillColor(108, 99, 255);
  doc.rect(0, 0, pageWidth, 18, 'F');
  doc.setFillColor(167, 139, 250);
  doc.rect(0, 15, pageWidth, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  const label = isAnswerKey ? 'ANSWER KEY & TEACHER GUIDE' : 'QUESTION PAPER';
  doc.text(label, pageWidth / 2, 10, { align: 'center' });
  doc.setTextColor(40, 40, 60);
}

function addMeta(doc, paper, pageWidth, isAnswerKey) {
  let y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 50);

  const title = isAnswerKey
    ? `${paper.paperTitle || paper.subject} — Answer Key`
    : (paper.paperTitle || `${paper.subject} Examination`);

  doc.text(title, pageWidth / 2, y, { align: 'center' });
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 98, 133);
  const infoLine = [
    paper.institution || 'Academic Institution',
    paper.examType || 'Examination',
    `Subject: ${paper.subject}`,
    paper.topic ? `Topic: ${paper.topic}` : null,
  ].filter(Boolean).join('   |   ');
  doc.text(infoLine, pageWidth / 2, y, { align: 'center' });
  y += 6;

  const details = [
    `Total Marks: ${paper.totalMarks}`,
    `Duration: ${paper.duration || '3 Hours'}`,
    `Difficulty: ${paper.difficulty || 'Mixed'}`,
    `Date: ${new Date().toLocaleDateString('en-IN')}`,
  ].join('   |   ');
  doc.text(details, pageWidth / 2, y, { align: 'center' });
  y += 5;

  // Divider
  doc.setDrawColor(200, 200, 220);
  doc.setLineWidth(0.4);
  doc.line(12, y, pageWidth - 12, y);
  return y + 6;
}

function getBloomsColor(category) {
  return BLOOMS_COLORS[category] || [108, 99, 255];
}

// ─── Export Question Paper PDF ─────────────────────────────────────────────
export function exportQuestionPaperPDF(paper) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  addHeader(doc, paper, pageWidth, false);
  let y = addMeta(doc, paper, pageWidth, false);

  // Instructions
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 140);
  doc.text('General Instructions: Answer all questions. All sections are compulsory unless stated otherwise.', margin, y);
  y += 8;

  (paper.sections || []).forEach(section => {
    // Section Header
    doc.setFillColor(230, 228, 255);
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(70, 60, 180);
    doc.text(section.name, margin + 4, y + 6.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 140);
    doc.text(section.description || '', pageWidth - margin - 4, y + 6.5, { align: 'right' });
    y += 14;

    (section.questions || []).forEach((q, idx) => {
      const remainingSpace = doc.internal.pageSize.getHeight() - y - 20;
      if (remainingSpace < 30) {
        doc.addPage();
        addHeader(doc, paper, pageWidth, false);
        y = 24;
      }

      // Question number circle
      doc.setFillColor(108, 99, 255);
      doc.circle(margin + 4, y + 3, 4, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`${q.questionNumber || idx + 1}`, margin + 4, y + 3 + 1, { align: 'center' });

      // Blooms badge
      const [br, bg, bb] = getBloomsColor(q.cognitiveCategory);
      doc.setFillColor(br, bg, bb);
      doc.roundedRect(pageWidth - margin - 28, y, 28, 6, 1.5, 1.5, 'F');
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text(q.cognitiveCategory || '', pageWidth - margin - 14, y + 4, { align: 'center' });

      // Question text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 30, 50);
      const questionLines = doc.splitTextToSize(q.questionText || '', contentWidth - 40);
      doc.text(questionLines, margin + 10, y + 4);
      y += Math.max(questionLines.length * 5, 8);

      // Marks
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 170);
      doc.text(`[${q.marks} mark${q.marks > 1 ? 's' : ''}]`, pageWidth - margin - 4, y - 2, { align: 'right' });

      // MCQ / T-F options (no answers)
      if (q.options && q.options.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        doc.setTextColor(60, 60, 80);
        const half = Math.ceil(q.options.length / 2);
        q.options.forEach((opt, oi) => {
          const col = oi < half ? margin + 12 : pageWidth / 2 + 4;
          const row = oi < half ? oi : oi - half;
          doc.text(opt, col, y + row * 5.5);
        });
        y += Math.ceil(q.options.length / 2) * 5.5 + 2;
      }

      // Fill blank visual underline
      if (section.questionType === 'fillblank') y += 2;

      y += 5;

      // Light separator
      doc.setDrawColor(220, 220, 235);
      doc.setLineWidth(0.2);
      doc.line(margin + 8, y - 2, pageWidth - margin, y - 2);
    });
    y += 4;
  });

  // Footer on every page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(160, 160, 180);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });
    doc.text('Generated by QPGen AI', margin, doc.internal.pageSize.getHeight() - 8);
  }

  const filename = `${(paper.subject || 'paper').replace(/\s+/g, '_')}_question_paper.pdf`;
  doc.save(filename);
}

// ─── Export Answer Key PDF ─────────────────────────────────────────────────
export function exportAnswerKeyPDF(paper) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  addHeader(doc, paper, pageWidth, true);
  let y = addMeta(doc, paper, pageWidth, true);

  // Bloom's summary table
  const bloomsSummary = {};
  (paper.sections || []).forEach(sec =>
    (sec.questions || []).forEach(q => {
      bloomsSummary[q.cognitiveCategory] = (bloomsSummary[q.cognitiveCategory] || 0) + (q.marks || 0);
    })
  );
  const summaryRows = Object.entries(bloomsSummary).map(([cat, marks]) => [cat, `${marks} marks`]);
  if (summaryRows.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(70, 60, 180);
    doc.text("Cognitive Level Distribution", margin, y);
    y += 3;
    autoTable(doc, {
      startY: y,
      head: [['Cognitive Level', 'Total Marks']],
      body: summaryRows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [108, 99, 255], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [246, 246, 252] },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  (paper.sections || []).forEach(section => {
    // Section header
    doc.setFillColor(230, 228, 255);
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(70, 60, 180);
    doc.text(`${section.name} — Answer Key`, margin + 4, y + 6.5);
    y += 14;

    (section.questions || []).forEach((q, idx) => {
      const remainingSpace = doc.internal.pageSize.getHeight() - y - 20;
      if (remainingSpace < 40) {
        doc.addPage();
        addHeader(doc, paper, pageWidth, true);
        y = 24;
      }

      // Question header row
      doc.setFillColor(248, 248, 255);
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 30, 50);
      doc.text(`Q${q.questionNumber || idx + 1}.`, margin + 3, y + 5);

      const qLines = doc.splitTextToSize(q.questionText || '', contentWidth - 50);
      doc.setFont('helvetica', 'normal');
      doc.text(qLines[0] || '', margin + 12, y + 5);
      doc.setTextColor(150, 150, 170);
      doc.setFontSize(7.5);
      doc.text(`[${q.marks} mark${q.marks > 1 ? 's' : ''}]`, pageWidth - margin - 2, y + 5, { align: 'right' });
      y += 8;

      if (qLines.length > 1) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 30, 50);
        const rest = qLines.slice(1).join(' ');
        const restLines = doc.splitTextToSize(rest, contentWidth - 14);
        doc.text(restLines, margin + 12, y);
        y += restLines.length * 5;
      }

      // Answer
      const [ar, ag, ab] = [52, 211, 153];
      doc.setFillColor(ar, ag, ab, 0.1);
      doc.setDrawColor(ar, ag, ab);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin + 2, y, contentWidth - 4, 0, 1.5, 1.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(20, 150, 100);
      doc.text('✓ Answer: ', margin + 4, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 50);
      const answerLines = doc.splitTextToSize(q.answer || 'N/A', contentWidth - 30);
      doc.text(answerLines, margin + 24, y + 5);
      y += answerLines.length * 5 + 4;

      // Cognitive category + reasoning
      const [cr, cg, cb] = getBloomsColor(q.cognitiveCategory);
      doc.setFillColor(cr, cg, cb);
      doc.roundedRect(margin + 2, y, 30, 5.5, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(q.cognitiveCategory || '', margin + 2 + 15, y + 3.8, { align: 'center' });

      if (q.categoryReasoning) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 100, 130);
        const rLines = doc.splitTextToSize(q.categoryReasoning, contentWidth - 40);
        doc.text(rLines, margin + 36, y + 3.8);
        y += Math.max(rLines.length * 4.5, 6) + 4;
      } else {
        y += 8;
      }

      doc.setDrawColor(220, 220, 235);
      doc.setLineWidth(0.2);
      doc.line(margin + 8, y - 1, pageWidth - margin, y - 1);
      y += 3;
    });
    y += 4;
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(160, 160, 180);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });
    doc.text('CONFIDENTIAL — For Teacher Use Only', margin, doc.internal.pageSize.getHeight() - 8);
  }

  const filename = `${(paper.subject || 'paper').replace(/\s+/g, '_')}_answer_key.pdf`;
  doc.save(filename);
}
