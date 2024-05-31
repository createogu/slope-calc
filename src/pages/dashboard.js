// src/pages/dashboard.js
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useRouter } from 'next/router';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [title, setTitle] = useState('');
  const [V_아래, setV_아래] = useState('');
  const [H_아래, setH_아래] = useState('');
  const [V_위, setV_위] = useState('');
  const [H_위, setH_위] = useState('');
  const [H, setH] = useState('');
  const [result, setResult] = useState(null);
  const router = useRouter();

  const calculate = async () => {
    const A = V_위 - V_아래;
    const B = V_아래;
    const C = V_위;
    const D = H_위 - H_아래;

    const A_rad = A * Math.PI / 180;
    const B_rad = B * Math.PI / 180;
    const C_rad = C * Math.PI / 180;
    const D_rad = D * Math.PI / 180;

    const L = H / (Math.tan(C_rad) - Math.tan(B_rad));
    const H1 = L * Math.tan(C_rad);
    const E = Math.sqrt(L ** 2 + H1 ** 2);
    const delta = E * Math.tan(D_rad);
    const slope = delta / H1;

    const result = {
      title,
      date: new Date().toISOString(),
      V_아래,
      H_아래,
      V_위,
      H_위,
      H,
      L,
      H1,
      E,
      delta,
      slope,
    };

    await addDoc(collection(db, 'calculations'), {
      ...result,
      userId: user.uid,
    });

    setResult(result);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className={styles.container}>
      <h1>계산기</h1>
      <div className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="title">제목:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="계산 제목"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="V_아래">V 아래 (°):</label>
          <input
            type="number"
            id="V_아래"
            value={V_아래}
            onChange={(e) => setV_아래(e.target.value)}
            placeholder="V 아래 (°)"
            step="0.0001"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="H_아래">H 아래 (°):</label>
          <input
            type="number"
            id="H_아래"
            value={H_아래}
            onChange={(e) => setH_아래(e.target.value)}
            placeholder="H 아래 (°)"
            step="0.0001"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="V_위">V 위 (°):</label>
          <input
            type="number"
            id="V_위"
            value={V_위}
            onChange={(e) => setV_위(e.target.value)}
            placeholder="V 위 (°)"
            step="0.0001"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="H_위">H 위 (°):</label>
          <input
            type="number"
            id="H_위"
            value={H_위}
            onChange={(e) => setH_위(e.target.value)}
            placeholder="H 위 (°)"
            step="0.0001"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="H">H (m):</label>
          <input
            type="number"
            id="H"
            value={H}
            onChange={(e) => setH(e.target.value)}
            placeholder="H (m)"
            step="0.01"
            required
          />
        </div>
        <button onClick={calculate} className={styles.button}>계산</button>
      </div>
      {result && (
        <div className={styles.resultSection}>
          <h2>계산 결과</h2>
          <div className={styles.resultContent}>
            <div className={styles.inputValues}>
              <h4>입력값</h4>
              <p><strong>V 아래 (°):</strong> {result.V_아래}</p>
              <p><strong>H 아래 (°):</strong> {result.H_아래}</p>
              <p><strong>V 위 (°):</strong> {result.V_위}</p>
              <p><strong>H 위 (°):</strong> {result.H_위}</p>
              <p><strong>H (m):</strong> {result.H}</p>
            </div>
            <div className={styles.outputValues}>
              <h4>결과값</h4>
              <p><strong>L (m):</strong> {result.L.toFixed(4)}</p>
              <p><strong>H1 (m):</strong> {result.H1.toFixed(4)}</p>
              <p><strong>E (m):</strong> {result.E.toFixed(4)}</p>
              <p><strong>δ (m):</strong> {result.delta.toFixed(4)}</p>
              <p><strong>기울기:</strong> {result.slope.toFixed(4)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
