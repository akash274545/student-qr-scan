import React, { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './LoginScreen';
import ScanScreen from './ScanScreen';
import RegisterScreen from './RegisterScreen';

const STORAGE_KEY = 'attendance_student';

export default function App() {
  const [student, setStudent] = useState(null);
  const [screen, setScreen] = useState('login'); // 'login' | 'register'

  // Restore session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setStudent(JSON.parse(saved));
    } catch (_) {}
  }, []);

  function handleLogin(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setStudent(user);
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    setStudent(null);
    setScreen('login');
  }

  if (student) {
    return <ScanScreen student={student} onLogout={handleLogout} />;
  }

  if (screen === 'register') {
    return <RegisterScreen onGoToLogin={() => setScreen('login')} />;
  }

  return <LoginScreen onLogin={handleLogin} onGoToRegister={() => setScreen('register')} />;
}
