import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';
import { registerUser } from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const login = authStore((state) => state.login);
  const [form, setForm] = useState({ name: '', email: '', role: 'student', password: '' });

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      login(
        {
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
        },
        response.data.token,
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Create account</p>
        <h1>Join EduGlobe AI</h1>
        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            Full name
            <input
              type="text"
              placeholder="Alex Carter"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              placeholder="alex@example.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            Role
            <select
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          <button className="primary-btn" type="submit">Create account</button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
