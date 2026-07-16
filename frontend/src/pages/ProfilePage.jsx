import authStore from '../store/authStore';

function ProfilePage() {
  const user = authStore((state) => state.user);

  return (
    <main className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>Manage your learning identity</h1>
        </div>
        <div className="pill">Student profile</div>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <h3>Personal details</h3>
          <p><strong>Name:</strong> {user?.name || 'Alex Carter'}</p>
          <p><strong>Email:</strong> {user?.email || 'alex@example.com'}</p>
          <p><strong>Role:</strong> {user?.role || 'student'}</p>
        </article>
        <article className="panel">
          <h3>Learning snapshot</h3>
          <p>School: Northview Academy</p>
          <p>Grade: 10</p>
          <p>Subjects: Maths, Science, English</p>
        </article>
      </section>
    </main>
  );
}

export default ProfilePage;
