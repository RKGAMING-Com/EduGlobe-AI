function ParentDashboardPage() {
  return (
    <main className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Parent</p>
          <h1>Parent dashboard</h1>
        </div>
        <div className="pill">Family view</div>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <h3>Student progress</h3>
          <p>Weekly improvement in science and reading.</p>
        </article>
        <article className="panel">
          <h3>Homework</h3>
          <p>One task needs attention today.</p>
        </article>
        <article className="panel">
          <h3>Notifications</h3>
          <p>New school updates and milestone alerts.</p>
        </article>
      </section>
    </main>
  );
}

export default ParentDashboardPage;
