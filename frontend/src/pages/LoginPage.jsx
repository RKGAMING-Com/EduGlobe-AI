import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const onSubmit = (event) => {
    event.preventDefault();
    navigate('/dashboard');
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Welcome back</p>

        <h1>Sign in to EduGlobe AI</h1>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="student@example.com"
              value={form.email}
              onChange={(event) =>
                setForm({
                  ...form,
                  email: event.target.value,
                })
              }
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(event) =>
                setForm({
                  ...form,
                  password: event.target.value,
                })
              }
              required
            />
          </label>

          <button className="primary-btn" type="submit">
            Continue
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;