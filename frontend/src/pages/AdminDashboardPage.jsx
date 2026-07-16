function AdminDashboardPage() {
  return (
    <main className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Administrator overview</h1>
        </div>
        <div className="pill">Operations</div>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <h3>Users</h3>
          <p>1,248 active learners and educators.</p>
        </article>
        <article className="panel">
          <h3>System health</h3>
          <p>All services running normally.</p>
        </article>
        <article className="panel">
          <h3>Reports</h3>
          <p>Weekly insights and admin alerts ready.</p>
        </article>
      </section>
    </main>
  );
}

export default AdminDashboardPage;
