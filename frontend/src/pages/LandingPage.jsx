import { Link } from 'react-router-dom';

const features = [
  'Personal AI guidance for everyday study questions',
  'Homework support with explanations and step-by-step help',
  'Smart notes, quizzes, and content generation',
  'Study planning that keeps learning organized',
];

function LandingPage() {
  return (
    <main className="app-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Binary Technology • EduGlobe AI v1.5</p>
          <h1>Learn smarter with a calm, personal AI study companion.</h1>
          <p className="hero-text">
            Students can get homework help, study guidance, quiz content, and clear plans in one simple workspace designed to feel supportive and easy to use.
          </p>
          <div className="hero-actions">
            <Link className="primary-btn" to="/register">Start learning</Link>
            <a className="secondary-btn" href="#features">Explore features</a>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-badge">Phase 1 • Foundation</div>
          <h2>Everything you need to study with confidence</h2>
          <ul>
            {features.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="feature-section" id="features">
        <article className="feature-card">
          <h3>Landing</h3>
          <p>Polished entry experience with clear value proposition, CTA actions, and premium layout.</p>
        </article>
        <article className="feature-card">
          <h3>Authentication</h3>
          <p>Secure student, teacher, parent, and admin flows are organized for future integration.</p>
        </article>
        <article className="feature-card">
          <h3>Dashboard</h3>
          <p>Study overview, continue learning, quick actions, and progress surfaces ready for expansion.</p>
        </article>
      </section>
    </main>
  );
}

export default LandingPage;
