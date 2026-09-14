function Register({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  handleRegister,
  switchToLogin,
  authLoading,
  authError,
  authSuccess,
}) {
  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>SpendWise</h1>

        <p className="auth-subtitle">
          Personal Expense Tracker
        </p>

        <h2>Create Account</h2>

        {authError && (
          <div className="error-message">
            {authError}
          </div>
        )}

        {authSuccess && (
          <div className="success-message">
            {authSuccess}
          </div>
        )}

        <div className="auth-form">

          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              disabled={authLoading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              disabled={authLoading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Minimum 6 characters"
              disabled={authLoading}
            />
          </div>

          <button
            className="primary-button auth-button"
            onClick={handleRegister}
            disabled={authLoading}
          >
            {authLoading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </div>

        <p className="auth-switch">
          Already have an account?
        </p>

        <button
          className="secondary-button auth-button"
          onClick={switchToLogin}
          disabled={authLoading}
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}

export default Register;