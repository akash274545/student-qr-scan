import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { findUserByUsername } from './firebase';

export default function LoginScreen({ onLogin, onGoToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError('');

    try {
      const user = await findUserByUsername(username.trim());

      if (!user) {
        setError('Invalid username or password.');
        return;
      }
      if (user.roleId !== 2) {
        setError('This app is for students only.');
        return;
      }
      if (!user.isApproved) {
        setError('Your account is pending approval. Please contact your teacher.');
        return;
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        setError('Invalid username or password.');
        return;
      }

      onLogin(user);
    } catch (err) {
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen-wrapper">
      <div className="card login-card">
        <div className="card-header">
          <div className="header-icon">🎓</div>
          <h2>Student Attendance</h2>
          <p>Sign in to mark your attendance</p>
        </div>

        <form onSubmit={handleSubmit} className="card-body">
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-toggle">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <><span className="spinner" /> Signing in...</>
            ) : (
              'Sign In'
            )}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={onGoToRegister}
            disabled={loading}
          >
            New student? Register here
          </button>
        </form>
      </div>
    </div>
  );
}
