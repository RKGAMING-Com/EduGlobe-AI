const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database/db');

dotenv.config();

const app = express();
const router = express.Router();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', router);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'EduGlobe AI backend' });
});

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  let isValid = false;
  const storedPassword = user.password || '';

  if (storedPassword === password) {
    isValid = true;
  } else {
    try {
      isValid = await bcrypt.compare(password, storedPassword);
    } catch (error) {
      isValid = false;
    }
  }

  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

  res.json({
    success: true,
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

router.post('/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insert = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    const result = insert.run(name, email, hashedPassword, role || 'student');

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

    return res.json({
      success: true,
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
});

router.post('/content/generate', (req, res) => {
  const { type, topic } = req.body;
  const output = `Generated ${type} content for ${topic || 'the selected topic'} with AI assistance.`;

  db.prepare('INSERT INTO content_items (type, topic, output) VALUES (?, ?, ?)').run(type, topic || 'general', output);

  res.json({ success: true, output });
});

const getTutorImageUrl = (question) => {
  const lower = (question || '').toLowerCase();

  if (lower.includes('photosynthesis') || lower.includes('plant') || lower.includes('biology')) {
    return 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80';
  }

  if (lower.includes('math') || lower.includes('algebra') || lower.includes('equation')) {
    return 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=900&q=80';
  }

  if (lower.includes('history') || lower.includes('war') || lower.includes('ancient')) {
    return 'https://images.unsplash.com/photo-1461360228754-6e81b0eaf0b4?auto=format&fit=crop&w=900&q=80';
  }

  if (lower.includes('geography') || lower.includes('country') || lower.includes('map')) {
    return 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80';
  }

  if (lower.includes('chemistry') || lower.includes('science')) {
    return 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80';
  }

  return null;
};

router.post('/ai/tutor', async (req, res) => {
  const { question, subject, board, mode } = req.body || {};
  const prompt = (question || '').trim();

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Please provide a question.' });
  }

  const subjectLabel = (subject || 'General').toString();
  const boardLabel = (board || 'Independent Learner').toString();
  const modeLabel = (mode || 'tutor').toString();

  const systemPrompt = `You are an expert educational tutor for students. Adapt to the subject ${subjectLabel}, the learner style ${boardLabel}, and the mode ${modeLabel}. For school subjects, follow a clear step-by-step teaching style and give hints before full answers. For music, create lyrics in a creative and student-friendly style. For all answers, use simple language, break ideas into steps, give examples, and end with a short follow-up question.`;
  const userPrompt = `Student question: ${prompt}`;

  try {
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b',
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_ctx: 2048,
        },
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed with ${response.status}`);
    }

    const data = await response.json();
    const answer = (data.response || '').trim();

    if (answer) {
      return res.json({ success: true, answer, imageUrl: getTutorImageUrl(prompt) });
    }
  } catch (error) {
    console.error('Tutor AI error:', error.message);
  }

  const lower = prompt.toLowerCase();
  let fallbackAnswer = '';

  if (lower.includes('math') || lower.includes('algebra') || lower.includes('equation')) {
    fallbackAnswer = `For ${prompt}, start by identifying what is being asked, write the known values clearly, and solve one step at a time. If this is algebra, isolate the variable and check your answer by substituting it back in.`;
  } else if (lower.includes('science') || lower.includes('biology') || lower.includes('physics') || lower.includes('chemistry')) {
    fallbackAnswer = `For ${prompt}, explain the idea in simple language first, then give a real-world example. Break it into cause, process, and result so it is easier to remember.`;
  } else if (lower.includes('history') || lower.includes('politics') || lower.includes('geography')) {
    fallbackAnswer = `For ${prompt}, explain the main idea, the important people or events, and why it mattered. A short timeline or comparison can help.`;
  } else if (lower.includes('essay') || lower.includes('write') || lower.includes('paragraph')) {
    fallbackAnswer = `For ${prompt}, use a simple structure: introduction, main points, and conclusion. Start with a strong opening sentence and support each point with clear evidence.`;
  } else {
    fallbackAnswer = `For “${prompt}”, I would explain it in three parts: define the key idea simply, give a worked example, and end with a short summary or practice question.`;
  }

  res.json({ success: true, answer: fallbackAnswer, imageUrl: getTutorImageUrl(prompt) });
});

module.exports = app;
