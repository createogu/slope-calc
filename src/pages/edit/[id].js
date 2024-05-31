// src/pages/edit/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import styles from './edit.module.css';

export default function EditCalculation() {
  const router = useRouter();
  const { id } = router.query;
  const [calculation, setCalculation] = useState(null);
  const [title, setTitle] = useState('');
  const [V_아래, setV_아래] = useState('');
  const [H_아래, setH_아래] = useState('');
  const [V_위, setV_위] = useState('');
  const [H_위, setH_위] = useState('');
  const [H, setH] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchCalculation = async () => {
      const docRef = doc(db, 'calculations', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCalculation(docSnap.data());
        setTitle(docSnap.data().title);
        setV_아래(docSnap.data().V_아래);
        setH_아래(docSnap.data().H_아래);
        setV_위(docSnap.data().V_위);
        setH_위(docSnap.data().H_위);
        setH(docSnap.data().H);
      } else {
        console.log('No such document!');
      }
    };

    fetchCalculation();
  }, [id]);

  const handleUpdate = async () => {
    const docRef = doc(db, 'calculations', id);
    await updateDoc(docRef, { title, V_아래, H_아래, V_위, H_위, H });
    router.push('/dashboard');
  };

  if (!calculation) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>계산 수정</h1>
      <div className={styles.inputGroup}>
        <label htmlFor="title">제목:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="V_아래">V 아래 (°):</label>
        <input
          type="number"
          id="V_아래"
          value={V_아래}
          onChange={(e) => setV_아래(e.target.value)}
          step="0.0001"
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="H_아래">H 아래 (°):</label>
        <input
          type="number"
          id="H_아래"
          value={H_아래}
          onChange={(e) => setH_아래(e.target.value)}
          step="0.0001"
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="V_위">V 위 (°):</label>
        <input
          type="number"
          id="V_위"
          value={V_위}
          onChange={(e) => setV_위(e.target.value)}
          step="0.0001"
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="H_위">H 위 (°):</label>
        <input
          type="number"
          id="H_위"
          value={H_위}
          onChange={(e) => setH_위(e.target.value)}
          step="0.0001"
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="H">H (m):</label>
        <input
          type="number"
          id="H"
          value={H}
          onChange={(e) => setH(e.target.value)}
          step="0.01"
        />
      </div>
      <button onClick={handleUpdate} className={styles.button}>수정</button>
    </div>
  );
}
