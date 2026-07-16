import { useState } from 'react';

const initialTasks = [
  { title: 'Math revision', time: '08:00', done: false },
  { title: 'Physics practice', time: '16:00', done: true },
];

function PlannerPage() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (index) => {
    setTasks((current) => current.map((task, taskIndex) => (taskIndex === index ? { ...task, done: !task.done } : task)));
  };

  return (
    <main className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Planner</p>
          <h1>Daily and weekly study planning</h1>
        </div>
        <div className="pill">Pomodoro ready</div>
      </section>

      <section className="panel">
        <h2>Today’s plan</h2>
        <ul className="task-list">
          {tasks.map((task, index) => (
            <li key={task.title} className={`task-item ${task.done ? 'done' : ''}`}>
              <label>
                <input type="checkbox" checked={task.done} onChange={() => toggleTask(index)} />
                <span>{task.title}</span>
              </label>
              <strong>{task.time}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <h3>Weekly focus</h3>
          <p>Math, biology, and essay writing.</p>
        </article>
        <article className="panel">
          <h3>Exam countdown</h3>
          <p>12 days remaining.</p>
        </article>
      </section>
    </main>
  );
}

export default PlannerPage;
