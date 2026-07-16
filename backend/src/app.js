const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database/db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const app = express();
const router = express.Router();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', router);


// ===============================
// HEALTH CHECK
// ===============================

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'EduGlobe AI backend',
  });
});


// ===============================
// LOGIN
// ===============================

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }


    let isValid = false;

    if (user.password === password) {
      isValid = true;
    } else {
      isValid = await bcrypt.compare(
        password,
        user.password
      );
    }


    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }


    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'dev-secret',
      {
        expiresIn: '7d',
      }
    );


    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });


  } catch (error) {

    console.error(
      'Login error:',
      error.message
    );

    res.status(500).json({
      success: false,
      message: 'Server error',
    });

  }
});



// ===============================
// REGISTER
// ===============================

router.post('/auth/register', async (req, res) => {

  const {
    name,
    email,
    password,
    role,
  } = req.body;


  try {

    const hashedPassword =
      await bcrypt.hash(password, 10);


    const insert =
      db.prepare(
        `INSERT INTO users 
        (name, email, password, role)
        VALUES (?, ?, ?, ?)`
      );


    const result = insert.run(
      name,
      email,
      hashedPassword,
      role || 'student'
    );


    const user =
      db.prepare(
        'SELECT * FROM users WHERE id = ?'
      )
      .get(result.lastInsertRowid);



    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'dev-secret',
      {
        expiresIn: '7d',
      }
    );


    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });


  } catch(error) {

    console.error(
      'Register error:',
      error.message
    );


    res.status(400).json({
      success:false,
      message:'User already exists',
    });

  }

});



// ===============================
// CONTENT GENERATOR
// ===============================

router.post('/content/generate', (req,res)=>{

  const {
    type,
    topic
  } = req.body;


  const output =
    `Generated ${type} content for ${topic || 'selected topic'} with AI assistance.`;


  db.prepare(
    `INSERT INTO content_items
    (type, topic, output)
    VALUES (?, ?, ?)`
  )
  .run(
    type,
    topic || 'general',
    output
  );


  res.json({
    success:true,
    output,
  });

});



// ===============================
// AI IMAGE HELPER
// ===============================

const getTutorImageUrl = (question)=>{

  const lower =
    (question || '')
    .toLowerCase();


  if(
    lower.includes('photosynthesis') ||
    lower.includes('plant') ||
    lower.includes('biology')
  ){
    return 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80';
  }


  if(
    lower.includes('math') ||
    lower.includes('algebra') ||
    lower.includes('equation')
  ){
    return 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=900&q=80';
  }


  if(
    lower.includes('history') ||
    lower.includes('war')
  ){
    return 'https://images.unsplash.com/photo-1461360228754-6e81b0eaf0b4?auto=format&fit=crop&w=900&q=80';
  }


  return null;

};

// ===============================
// GEMINI AI TUTOR
// ===============================

router.post('/ai/tutor', async (req, res) => {

  const {
    question,
    subject,
    board,
    mode
  } = req.body || {};


  const prompt =
    (question || '').trim();


  if (!prompt) {

    return res.status(400).json({
      success:false,
      message:'Please provide a question.'
    });

  }


  const subjectLabel =
    (subject || 'General').toString();


  const boardLabel =
    (board || 'Independent Learner').toString();


  const modeLabel =
    (mode || 'Tutor').toString();



  const systemPrompt = `
You are EduGlobe AI, an advanced educational tutor.

Subject:
${subjectLabel}

Student level:
${boardLabel}

Learning mode:
${modeLabel}

Rules:
- Explain step by step.
- Use simple language.
- Give examples.
- Help students understand concepts.
- Give hints before full answers when possible.
- End with a short practice question.
`;



  try {

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.0-flash"
      });



    const result =
      await model.generateContent(
        `${systemPrompt}

Student question:
${prompt}`
      );



    const answer =
      result.response.text();



    return res.json({

      success:true,

      answer,

      imageUrl:
        getTutorImageUrl(prompt)

    });



  } catch(error) {


    console.error(
      "Gemini AI Error:",
      error.message
    );



    return res.json({

      success:true,

      answer:
      "EduGlobe AI is temporarily unavailable. Please try again.",

      imageUrl:
        getTutorImageUrl(prompt)

    });

  }

});



// ===============================
// EXPORT APP
// ===============================

module.exports = app;