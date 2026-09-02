const DB_URL = 'YOUR_FIREBASE_DATABASE_URL';


export async function findUserByUsername(username) {
  const res = await fetch(`${DB_URL}/users.json`);
  if (!res.ok) throw new Error('Failed to connect to database');
  const data = await res.json();
  if (!data) return null;
  return (
    Object.values(data).find(
      (u) => u.username && u.username.toLowerCase() === username.toLowerCase()
    ) || null
  );
}

export async function getAttendanceToken(tokenValue) {
  const res = await fetch(`${DB_URL}/attendanceTokens.json`);
  if (!res.ok) throw new Error('Failed to fetch tokens');
  const data = await res.json();
  if (!data) return null;
  return Object.values(data).find((t) => t.token === tokenValue) || null;
}

export async function hasMarkedAttendanceToday(studentId, subjectId) {
  const res = await fetch(`${DB_URL}/attendance.json`);
  if (!res.ok) return false;
  const data = await res.json();
  if (!data) return false;
  const today = new Date().toDateString();
  return Object.values(data).some(
    (a) =>
      a.studentId === studentId &&
      a.subjectId === subjectId &&
      new Date(a.attendanceDate).toDateString() === today
  );
}

export async function saveAttendance(record) {
  const id = crypto.randomUUID();
  const payload = { ...record, id, createdAt: new Date().toISOString() };
  const res = await fetch(`${DB_URL}/attendance/${id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to save attendance');
  return id;
}

export async function getSubjectById(subjectId) {
  const res = await fetch(`${DB_URL}/subjects/${subjectId}.json`);
  if (!res.ok) return null;
  return res.json();
}

export async function checkUsernameExists(username) {
  const res = await fetch(`${DB_URL}/users.json`);
  if (!res.ok) throw new Error('Failed to connect to database');
  const data = await res.json();
  if (!data) return false;
  return Object.values(data).some(
    (u) => u.username && u.username.toLowerCase() === username.toLowerCase()
  );
}

export async function checkEmailExists(email) {
  const res = await fetch(`${DB_URL}/users.json`);
  if (!res.ok) throw new Error('Failed to connect to database');
  const data = await res.json();
  if (!data) return false;
  return Object.values(data).some(
    (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
  );
}

export async function registerStudent(userData) {
  const id = crypto.randomUUID();
  const payload = { ...userData, id };
  const res = await fetch(`${DB_URL}/users/${id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to register student');
  return id;
}
