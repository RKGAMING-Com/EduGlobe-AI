function SettingsPage() {
  return (
    <main className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Personalize your learning environment</h1>
        </div>
        <div className="pill">Preferences</div>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <h3>Theme</h3>
          <p>Light mode, dark mode, and auto themes ready for future toggling.</p>
        </article>
        <article className="panel">
          <h3>Notifications</h3>
          <p>Homework reminders, weekly summaries, and milestone alerts.</p>
        </article>
        <article className="panel">
          <h3>Privacy</h3>
          <p>Secure account controls, data visibility, and consent settings.</p>
        </article>
      </section>
    </main>
  );
}

export default SettingsPage;
