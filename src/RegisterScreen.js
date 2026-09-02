import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { checkUsernameExists, checkEmailExists, registerStudent } from './firebase';

export default function RegisterScreen({ onGoToLogin }) {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    parentEmail: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validateFullName(name) {
    const trimmed = name.trim();
    const words = trimmed.split(/\s+/);
    return (
      trimmed.length >= 3 &&
      trimmed.length <= 50 &&
      /^[a-zA-Z\s]+$/.test(trimmed) &&
      words.length >= 2 &&
      words.every((w) => w.length > 0)
    );
  }

  function validateUsername(u) {
    return /^[a-zA-Z0-9]{3,50}$/.test(u.trim());
  }

  function validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  }

  function validatePassword(p) {
    return (
      p.length >= 6 &&
      /[A-Z]/.test(p) &&
      /[a-z]/.test(p) &&
      /[0-9]/.test(p) &&
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { fullName, username, email, parentEmail, password, confirmPassword } = form;

    if (!validateFullName(fullName)) {
      setError('Full name must be at least 2 words, letters only (e.g. John Smith).');
      return;
    }
    if (!validateUsername(username)) {
      setError('Username must be 3–50 characters, letters and numbers only.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (parentEmail.trim() && !validateEmail(parentEmail)) {
      setError('Please enter a valid parent email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters and include uppercase, lowercase, number, and special character.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const usernameTaken = await checkUsernameExists(username.trim());
      if (usernameTaken) {
        setError('Username is already taken. Please choose another.');
        return;
      }

      const emailTaken = await checkEmailExists(email.trim());
      if (emailTaken) {
        setError('An account with this email already exists.');
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // IST formatted timestamp
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istDate = new Date(now.getTime() + istOffset);
      const createdAt = istDate.toISOString().replace('T', ' ').substring(0, 19) + ' IST';

      await registerStudent({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        parentEmail: parentEmail.trim() || null,
        password: hashedPassword,
        roleId: 2,
        isApproved: false,
        createdAt,
      });

      setSuccess('Registration successful! Your account is pending approval from a teacher. You can login once approved.');
      setForm({ fullName: '', username: '', email: '', parentEmail: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError('Registration failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen-wrapper">
      <div className="card register-card">
        <div className="card-header">
          <div className="header-icon">📝</div>
          <h2>Student Registration</h2>
          <p>Create your student account</p>
        </div>

        <form onSubmit={handleSubmit} className="card-body">
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <span>✅</span> {success}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={form.fullName}
                onChange={set('fullName')}
                placeholder="e.g. John Smith"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                value={form.username}
                onChange={set('username')}
                placeholder="Letters and numbers only"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Parent's Email</label>
              <input
                type="email"
                value={form.parentEmail}
                onChange={set('parentEmail')}
                placeholder="parent@example.com (optional)"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <div className="input-with-toggle">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min 6 chars, A-Z a-z 0-9 @#!"
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

            <div className="form-group">
              <label>Confirm Password *</label>
              <div className="input-with-toggle">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  placeholder="Re-enter your password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                >
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          </div>

          <div className="alert alert-info" style={{ marginTop: 0 }}>
            📌 After registration your account needs teacher approval before you can log in.
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <><span className="spinner" /> Registering...</>
            ) : (
              'Register'
            )}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={onGoToLogin}
            disabled={loading}
          >
            Already have an account? Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
