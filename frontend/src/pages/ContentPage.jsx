import { useMemo, useState } from 'react';
import { generateContent } from '../services/api';

const templates = {
  notes: {
    title: 'Chapter notes',
    prompt: 'Generate concise chapter notes with summary, key formulas, and study tips.',
  },
  quiz: {
    title: 'Quiz generator',
    prompt: 'Create 5 MCQs with answer key and difficulty tags.',
  },
  ppt: {
    title: 'Presentation builder',
    prompt: 'Generate a slide outline with title, bullets, and speaking notes.',
  },
};

function ContentPage() {
  const [selectedType, setSelectedType] = useState('notes');
  const [topic, setTopic] = useState('Photosynthesis');
  const [output, setOutput] = useState('Select a content type and topic to generate learning material.');

  const template = useMemo(() => templates[selectedType], [selectedType]);

  const handleGenerate = async () => {
    try {
      const response = await generateContent({ type: selectedType, topic });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Unable to generate content right now. Please try again later.');
      console.error(error);
    }
  };

  return (
    <main className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Content studio</p>
          <h1>Create notes, quizzes, and presentations</h1>
        </div>
        <div className="pill">AI content generation</div>
      </section>

      <section className="panel">
        <div className="content-controls">
          <label>
            Content type
            <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
              <option value="notes">Notes</option>
              <option value="quiz">Quiz</option>
              <option value="ppt">Presentation</option>
            </select>
          </label>

          <label>
            Topic
            <input value={topic} onChange={(event) => setTopic(event.target.value)} />
          </label>

          <button className="primary-btn" type="button" onClick={handleGenerate}>
            Generate
          </button>
        </div>
      </section>

      <section className="panel wide-panel">
        <h2>{template.title}</h2>
        <p>{output}</p>
      </section>
    </main>
  );
}

export default ContentPage;
