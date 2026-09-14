function Profile({
  user,
  onClose,
  onLogout,
}) {
  return (
    <section className="profile-section">
      <div className="profile-header">
        <div>
          <h2>My Account</h2>
          <p>Your SpendWise account information</p>
        </div>

        <button
          className="secondary-button"
          onClick={onClose}
        >
          Back to Dashboard
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="profile-details">
          <div className="profile-item">
            <span className="profile-label">
              Name
            </span>

            <strong>
              {user?.name || "-"}
            </strong>
          </div>

          <div className="profile-item">
            <span className="profile-label">
              Email
            </span>

            <strong>
              {user?.email || "-"}
            </strong>
          </div>

          <div className="profile-item">
            <span className="profile-label">
              Account
            </span>

            <strong>
              Active
            </strong>
          </div>
        </div>
      </div>

      <button
        className="logout-button"
        onClick={onLogout}
      >
        Logout
      </button>
    </section>
  );
}

export default Profile;