import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useRouter } from 'next/router';
import { FaRedoAlt, FaSave, FaTrashAlt } from 'react-icons/fa'; // 아이콘 사용을 위한 import
import styles from './dashboard.module.css';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [title, setTitle] = useState('');
  const [V_아래, setV_아래] = useState('');
  const [H_아래, setH_아래] = useState('');
  const [V_위, setV_위] = useState('');
  const [H_위, setH_위] = useState('');
  const [H, setH] = useState('');
  const [result, setResult] = useState({});
  const [basicData, setBasicData] = useState({});
  const router = useRouter();

  const calculateValues = () => {
    const V_아래_calculated = V_아래 ? Math.abs((V_아래 <= 180 ? 90 - V_아래 : 270 - V_아래).toFixed(4)) : '';
    const V_위_calculated = V_위 ? Math.abs((V_위 <= 180 ? 90 - V_위 : 270 - V_위).toFixed(4)) : '';
    
    if (V_아래 && V_위) {
      const A = (V_위_calculated - V_아래_calculated).toFixed(4);
      const B = V_아래_calculated;
      const C = V_위_calculated;
      const D = (H_위 - H_아래).toFixed(4);

      const A_rad = (A * Math.PI / 180).toFixed(4);
      const B_rad = (B * Math.PI / 180).toFixed(4);
      const C_rad = (C * Math.PI / 180).toFixed(4);
      const D_rad = (D * Math.PI / 180).toFixed(4);

      setBasicData({ A, B, C, D, A_rad, B_rad, C_rad, D_rad });

      const L = (H / (Math.tan(C_rad) - Math.tan(B_rad))).toFixed(4);
      const H1 = (L * Math.tan(C_rad)).toFixed(4);
      const E = (Math.sqrt(L ** 2 + H1 ** 2)).toFixed(4);
      const delta = (E * Math.tan(D_rad)).toFixed(4);
      const slope = (delta / H1).toFixed(4);

      setResult({ L, H1, E, delta, slope });
    }
  };

  useEffect(() => {
    calculateValues();
  }, [V_아래, H_아래, V_위, H_위, H]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/');
    return null;
  }

  const handleSave = async () => {
    const data = {
      title,
      date: new Date().toISOString(),
      V_아래, H_아래, V_위, H_위, H,
      ...basicData,
      ...result
    };

    await addDoc(collection(db, 'calculations'), {
      ...data,
      userId: user.uid,
    });

    setResult(data);
  };

  const handleReset = () => {
    setTitle('');
    setV_아래('');
    setH_아래('');
    setV_위('');
    setH_위('');
    setH('');
    setResult({});
    setBasicData({});
  };

  const handleFieldReset = (setter) => () => {
    setter('');
  };

  return (
    <div className={styles.container}>
      <h1>계산기</h1>
      <div className={styles.inputSection}>
        <table className={styles.inputTable}>
          <thead>
            <tr>
              <th>항목</th>
              <th>값</th>
              <th>초기화</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>제목:</td>
              <td>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="계산 제목" 
                  required 
                />
              </td>
              <td>
                <button onClick={handleFieldReset(setTitle)} className={styles.resetButton}><FaRedoAlt /></button>
              </td>
            </tr>
            <tr>
              <td>V 아래 (°): <span className={styles.calculatedValue}>{V_아래 && ` (${Math.abs((V_아래 <= 180 ? 90 - V_아래 : 270 - V_아래).toFixed(4))}°)`}</span></td>
              <td>
                <input 
                  type="number" 
                  value={V_아래} 
                  onChange={(e) => setV_아래(e.target.value)} 
                  placeholder="V 아래 (°)" 
                  step="0.0001" 
                  required 
                />
              </td>
              <td>
                <button onClick={handleFieldReset(setV_아래)} className={styles.resetButton}><FaRedoAlt /></button>
              </td>
            </tr>
            <tr>
              <td>H 아래 (°):</td>
              <td>
                <input 
                  type="number" 
                  value={H_아래} 
                  onChange={(e) => setH_아래(e.target.value)} 
                  placeholder="H 아래 (°)" 
                  step="0.0001" 
                  required 
                />
              </td>
              <td>
                <button onClick={handleFieldReset(setH_아래)} className={styles.resetButton}><FaRedoAlt /></button>
              </td>
            </tr>
            <tr>
              <td>V 위 (°): <span className={styles.calculatedValue}>{V_위 && ` (${Math.abs((V_위 <= 180 ? 90 - V_위 : 270 - V_위).toFixed(4))}°)`}</span></td>
              <td>
                <input 
                  type="number" 
                  value={V_위} 
                  onChange={(e) => setV_위(e.target.value)} 
                  placeholder="V 위 (°)" 
                  step="0.0001" 
                  required 
                />
              </td>
              <td>
                <button onClick={handleFieldReset(setV_위)} className={styles.resetButton}><FaRedoAlt /></button>
              </td>
            </tr>
            <tr>
              <td>H 위 (°):</td>
              <td>
                <input 
                  type="number" 
                  value={H_위} 
                  onChange={(e) => setH_위(e.target.value)} 
                  placeholder="H 위 (°)" 
                  step="0.0001" 
                  required 
                />
              </td>
              <td>
                <button onClick={handleFieldReset(setH_위)} className={styles.resetButton}><FaRedoAlt /></button>
              </td>
            </tr>
            <tr>
              <td>H (m):</td>
              <td>
                <input 
                  type="number" 
                  value={H} 
                  onChange={(e) => setH(e.target.value)} 
                  placeholder="H (m)" 
                  step="0.01" 
                  required 
                />
              </td>
              <td>
                <button onClick={handleFieldReset(setH)} className={styles.resetButton}><FaRedoAlt /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.resultSection}>
        <h2>계산 결과</h2>
        <div className={styles.resultContent}>
        <table className={styles.resultTable}>
  <thead>
    <tr>
      <th>기본 계산 데이터</th>
      <th>각도(도분법)</th>
      <th>각도(라디안)</th>
      <th>계산</th>
      <th>값</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>A</td>
      <td>{basicData.A}</td>
      <td>{basicData.A_rad}</td>
      <td>L</td>
      <td>{result.L}</td>
    </tr>
    <tr>
      <td>B</td>
      <td>{basicData.B}</td>
      <td>{basicData.B_rad}</td>
      <td>H1</td>
      <td>{result.H1}</td>
    </tr>
    <tr>
      <td>C</td>
      <td>{basicData.C}</td>
      <td>{basicData.C_rad}</td>
      <td>E</td>
      <td>{result.E}</td>
    </tr>
    <tr>
      <td>D</td>
      <td>{basicData.D}</td>
      <td>{basicData.D_rad}</td>
      <td>δ</td>
      <td>{result.delta}</td>
    </tr>
    <tr>
      <td colSpan="3"></td>
      <td>기울기</td>
      <td>{result.slope}</td>
    </tr>
  </tbody>
</table>

        </div>
      </div>
      <div className={styles.actionButtons}>
        <button onClick={handleSave} className={`${styles.button} ${styles.saveButton}`}><FaSave /> 저장</button>
        <button onClick={handleReset} className={`${styles.button} ${styles.resetButton}`}><FaTrashAlt /> 초기화</button>
      </div>
    </div>
  );
}
