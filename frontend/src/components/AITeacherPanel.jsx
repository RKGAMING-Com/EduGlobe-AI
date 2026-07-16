import { useState } from 'react';
import { askTutor } from '../services/api';

const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Music', 'General'];
const BOARDS = ['ICSE', 'CBSE', 'State Board', 'Independent Learner'];

const formatMessage = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return <span key={`${part}-${index}`} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
  });
};

const starterMessages = [
  { role: 'assistant', text: 'Hello! I am your AI teacher. Ask me about any topic, and I will explain it step by step.' },
  { role: 'assistant', text: 'Try asking: “Explain photosynthesis in simple terms” or “Give me practice questions for algebra.”' },
];

function AITeacherPanel() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('General');
  const [board, setBoard] = useState('Independent Learner');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [imageInput, setImageInput] = useState(null);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input.trim() };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await askTutor({
        question: input.trim(),
        subject,
        board,
        voiceEnabled,
        mode: subject === 'Music' ? 'lyrics' : 'tutor',
      });
      const reply = {
        role: 'assistant',
        text: response.data.answer,
        imageUrl: response.data.imageUrl || null,
      };
      setMessages((current) => [...current, reply]);
    } catch (error) {
      setMessages((current) => [...current, {
        role: 'assistant',
        text: 'I hit a temporary issue. Please try asking again in a simpler way.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ai-panel">
      <div className="ai-header">
        <div>
          <p className="eyebrow">AI teacher</p>
          <h2>Personalized learning coach</h2>
        </div>
        <div className="pill">Adaptive guidance</div>
      </div>

      <div className="ai-controls">
        <div className="chip-row">
          {SUBJECTS.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${subject === item ? 'active' : ''}`}
              onClick={() => setSubject(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="control-group">
          <span>Board / learning style</span>
          <select value={board} onChange={(event) => setBoard(event.target.value)}>
            {BOARDS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="ai-thread">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
            <div>{formatMessage(message.text)}</div>
            {message.imageUrl ? (
              <img src={message.imageUrl} alt="Educational illustration" className="message-image" />
            ) : null}
          </div>
        ))}
      </div>

      <form className="ai-form" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={subject === 'Music' ? 'Ask for lyrics or a music study idea...' : 'Ask your next question...'}
        />
        <label className="inline-option">
          <input type="checkbox" checked={voiceEnabled} onChange={() => setVoiceEnabled((value) => !value)} />
          Voice mode
        </label>
        <label className="inline-option">
          <input type="file" accept="image/*" onChange={(event) => setImageInput(event.target.files?.[0] || null)} />
          Add image
        </label>
        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </section>
  );
}

export default AITeacherPanel;
