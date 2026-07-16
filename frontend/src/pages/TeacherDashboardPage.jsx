function TeacherDashboardPage() {
  return (
    <main className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Teacher</p>
          <h1>Teacher dashboard</h1>
        </div>
        <div className="pill">Classroom</div>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <h3>Assignments</h3>
          <p>4 new submissions awaiting review.</p>
        </article>
        <article className="panel">
          <h3>Class insights</h3>
          <p>Students show strong progress in maths.</p>
        </article>
        <article className="panel">
          <h3>Resources</h3>
          <p>AI-generated notes and quizzes ready to share.</p>
        </article>
      </section>
    </main>
  );
}

export default TeacherDashboardPage;
