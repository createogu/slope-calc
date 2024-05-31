// src/pages/history.js
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDocs, query, collection, where, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useRouter } from 'next/router';
import styles from './history.module.css';

export default function History() {
  const [user, loading] = useAuthState(auth);
  const [calculations, setCalculations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchCalculations();
    }
  }, [user]);

  const fetchCalculations = async () => {
    if (user) {
      const q = query(collection(db, 'calculations'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const calcData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCalculations(calcData);
    }
  };

  const deleteCalculation = async (id) => {
    await deleteDoc(doc(db, 'calculations', id));
    fetchCalculations();
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
      <h1>계산 결과</h1>
      <div className={styles.historySection}>
        {calculations.map((calc) => (
          <div key={calc.id} className={styles.historyItem}>
            <h3>{calc.title}</h3>
            <div className={styles.historyContent}>
              <div className={styles.inputValues}>
                <h4>입력값</h4>
                <p><strong>V 아래 (°):</strong> {calc.V_아래}</p>
                <p><strong>H 아래 (°):</strong> {calc.H_아래}</p>
                <p><strong>V 위 (°):</strong> {calc.V_위}</p>
                <p><strong>H 위 (°):</strong> {calc.H_위}</p>
                <p><strong>H (m):</strong> {calc.H}</p>
              </div>
              <div className={styles.outputValues}>
                <h4>결과값</h4>
                <p><strong>L (m):</strong> {calc.L.toFixed(4)}</p>
                <p><strong>H1 (m):</strong> {calc.H1.toFixed(4)}</p>
                <p><strong>E (m):</strong> {calc.E.toFixed(4)}</p>
                <p><strong>δ (m):</strong> {calc.delta.toFixed(4)}</p>
                <p><strong>기울기:</strong> {calc.slope.toFixed(4)}</p>
              </div>
            </div>
            <div className={styles.actionButtons}>
              <button onClick={() => router.push(`/edit/${calc.id}`)} className={styles.button}>수정</button>
              <button onClick={() => deleteCalculation(calc.id)} className={styles.button}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
