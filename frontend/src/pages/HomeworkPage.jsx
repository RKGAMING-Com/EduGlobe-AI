import { useState } from 'react';

function HomeworkPage() {
  const [fileName, setFileName] = useState('No file selected');
  const [extractedText, setExtractedText] = useState('Upload a homework image or PDF to extract text and receive AI help.');
  const [analysis, setAnalysis] = useState('The assistant will explain the problem, provide hints, and break the solution into steps.');

  const onFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFileName(selectedFile.name);
    setExtractedText(`Sample extracted text from ${selectedFile.name}: Solve for x in 3x + 7 = 19.`);
    setAnalysis('Hint: subtract 7 from both sides, then divide by 3. The final answer is x = 4.');
  };

  return (
    <main className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Homework</p>
          <h1>Upload work and get AI support</h1>
        </div>
        <div className="pill">OCR + explanation</div>
      </section>

      <section className="homework-layout">
        <div className="panel">
          <h2>Upload homework</h2>
          <label className="upload-box">
            <input type="file" accept="image/*,.pdf" onChange={onFileChange} />
            <span>Choose file</span>
          </label>
          <p className="muted">Selected file: {fileName}</p>
        </div>

        <div className="panel">
          <h2>Extracted text</h2>
          <p>{extractedText}</p>
        </div>
      </section>

      <section className="panel wide-panel">
        <h2>AI explanation</h2>
        <p>{analysis}</p>
      </section>
    </main>
  );
}

export default HomeworkPage;
