function Login({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  switchToRegister,
  authLoading,
  authError,
}) {
  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>SpendWise</h1>

        <p className="auth-subtitle">
          Personal Expense Tracker
        </p>

        <h2>Login</h2>

        {authError && (
          <div className="error-message">
            {authError}
          </div>
        )}

        <div className="auth-form">

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
              placeholder="Enter your password"
              disabled={authLoading}
            />
          </div>

          <button
            className="primary-button auth-button"
            onClick={handleLogin}
            disabled={authLoading}
          >
            {authLoading
              ? "Logging in..."
              : "Login"}
          </button>

        </div>

        <p className="auth-switch">
          Don't have an account?
        </p>

        <button
          className="secondary-button auth-button"
          onClick={switchToRegister}
          disabled={authLoading}
        >
          Create Account
        </button>

      </div>

    </div>
  );
}

export default Login;