import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';
import { loginUser } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const login = authStore((state) => state.login);
  const [form, setForm] = useState({ email: '', password: '' });

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginUser({ email: form.email, password: form.password });
      login(
        {
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
        },
        response.data.token,
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
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
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          <button className="primary-btn" type="submit">Continue</button>
        </form>
        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
