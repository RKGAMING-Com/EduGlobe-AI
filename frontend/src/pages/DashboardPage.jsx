import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';
import AITeacherPanel from '../components/AITeacherPanel';

function DashboardPage() {
  const navigate = useNavigate();
  const user = authStore((state) => state.user);
  const logout = authStore((state) => state.logout);
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const cards = [
    {
      title: 'Continue learning',
      detail: 'Pick up where you left off and keep momentum going.',
    },
    {
      title: 'Homework',
      detail: 'Review tasks and get helpful explanations quickly.',
    },
    {
      title: 'AI Teacher',
      detail: 'Ask questions and get guidance in a relaxed study flow.',
    },
  ];

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Good morning</p>
          <h1>
            Welcome back, {user?.name || 'Student'}
          </h1>
        </div>

        <div className="dashboard-actions">
          <div className="pill">
            {user?.role || 'student'} dashboard
          </div>

          <button
            className="secondary-btn"
            type="button"
            onClick={onLogout}
          >
            Log out
          </button>
        </div>
      </header>

      <section className="dashboard-grid">
        {cards.map((card) => (
          <article className="feature-card" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.detail}</p>
          </article>
        ))}
      </section>

      <AITeacherPanel />
    </main>
  );
}

export default DashboardPage;
