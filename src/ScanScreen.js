import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  getAttendanceToken,
  hasMarkedAttendanceToday,
  saveAttendance,
  getSubjectById,
} from './firebase';

const READER_ID = 'qr-reader';

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function extractToken(raw) {
  if (!raw) return '';
  const s = raw.trim();
  try {
    if (s.startsWith('http://') || s.startsWith('https://')) {
      const t = new URL(s).searchParams.get('token');
      if (t) return t;
    }
  } catch (_) {}
  const m = s.match(/token=([A-Za-z0-9-]+)/);
  return m ? m[1] : s;
}

export default function ScanScreen({ student, onLogout }) {
  const [locStatus, setLocStatus] = useState('Acquiring location...');
  const [status, setStatus] = useState(null); // { msg, type: 'success'|'error'|'info' }
  const [done, setDone] = useState(false); // attendance marked — scanner stopped

  const locationRef = useRef(null);
  const processingRef = useRef(false);
  const scannerRef = useRef(null);
  const startedRef = useRef(false);

  // Continuously watch location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocStatus('Geolocation not supported');
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        locationRef.current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocStatus('Location ready ✓');
      },
      () => setLocStatus('Location denied — please allow location access'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // Start QR camera scanner
  useEffect(() => {
    if (startedRef.current || done) return;
    startedRef.current = true;

    const scanner = new Html5Qrcode(READER_ID);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (text) => processQr(text),
        () => {}
      )
      .catch((err) => {
        console.warn('Camera error:', err);
        setStatus({ msg: 'Camera not available. Use the upload option below.', type: 'info' });
      });

    return () => {
      startedRef.current = false;
      const s = scannerRef.current;
      if (s) {
        scannerRef.current = null;
        try {
          s.stop()
            .catch(() => {})
            .finally(() => { try { s.clear(); } catch (_) {} });
        } catch (_) {
          try { s.clear(); } catch (_2) {}
        }
      }
    };
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  async function processQr(raw) {
    if (processingRef.current) return;
    processingRef.current = true;
    setStatus({ msg: 'Verifying QR code...', type: 'info' });

    try {
      const tokenValue = extractToken(raw);
      if (!tokenValue) throw new Error('Invalid QR code.');

      // Fetch token record
      const tokenRecord = await getAttendanceToken(tokenValue);
      if (!tokenRecord) throw new Error('QR code not recognised. Please try again.');
      if (!tokenRecord.isActive || tokenRecord.expired)
        throw new Error('This QR code has expired.');
      if (new Date(tokenRecord.expiresAt) < new Date())
        throw new Error('This QR code has expired.');

      // Location check
      const loc = locationRef.current;
      if (!loc)
        throw new Error('Location not ready. Please allow location access and try again.');

      if (tokenRecord.teacherLatitude && tokenRecord.teacherLongitude) {
        const dist = haversineDistance(
          tokenRecord.teacherLatitude,
          tokenRecord.teacherLongitude,
          loc.lat,
          loc.lng
        );
        if (dist > 100) {
          throw new Error(
            `You are ${Math.round(dist)}m away from the classroom. You must be within 100m.`
          );
        }
      }

      // Already marked today?
      const alreadyMarked = await hasMarkedAttendanceToday(
        student.id,
        tokenRecord.subjectId
      );
      if (alreadyMarked)
        throw new Error('Attendance already marked for this subject today.');

      // Save attendance
      await saveAttendance({
        studentId: student.id,
        subjectId: tokenRecord.subjectId,
        attendanceDate: new Date().toISOString(),
        latitude: loc.lat,
        longitude: loc.lng,
        locationAddress: `Lat: ${loc.lat.toFixed(5)}, Lng: ${loc.lng.toFixed(5)} (QR)`,
        status: 'PRESENT',
      });

      // Get subject name
      let subjectName = 'your subject';
      try {
        const subject = await getSubjectById(tokenRecord.subjectId);
        if (subject) subjectName = subject.subjectName || subject.name || subjectName;
      } catch (_) {}

      // Stop scanner — attendance done
      stopScanner();
      setDone(true);
      setStatus({ msg: `✅ Attendance marked for ${subjectName}!`, type: 'success' });
    } catch (err) {
      setStatus({ msg: err.message, type: 'error' });
    } finally {
      processingRef.current = false;
    }
  }

  function stopScanner() {
    const s = scannerRef.current;
    if (!s) return;
    scannerRef.current = null;
    startedRef.current = false;
    try {
      s.stop()
        .catch(() => {})
        .finally(() => { try { s.clear(); } catch (_) {} });
    } catch (_) {
      try { s.clear(); } catch (_2) {}
    }
  }

  function handleScanAnother() {
    setDone(false);
    setStatus(null);
    processingRef.current = false;
    startedRef.current = false;
  }

  const locColor =
    locStatus.includes('ready') ? '#28a745' :
    locStatus.includes('denied') || locStatus.includes('not supported') ? '#dc3545' :
    '#fd7e14';

  return (
    <div className="screen-wrapper">
      <div className="card scan-card">
        {/* Header */}
        <div className="card-header">
          <div className="header-row">
            <div>
              <div className="header-icon">📷</div>
              <h2>Mark Attendance</h2>
              <p>Welcome, {student.fullName}</p>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Location indicator */}
          <div className="loc-badge" style={{ color: locColor }}>
            📍 {locStatus}
          </div>

          {/* Status message */}
          {status && (
            <div className={`alert alert-${status.type}`}>
              {status.msg}
            </div>
          )}

          {!done ? (
            <>
              {/* Camera scanner */}
              <div className="scanner-wrapper">
                <div id={READER_ID} />
              </div>

              <p className="scan-hint">Point your camera at the QR code</p>
            </>
          ) : (
            <div className="done-state">
              <div className="done-icon">✅</div>
              <button className="btn-secondary" onClick={handleScanAnother}>
                Scan Another QR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
