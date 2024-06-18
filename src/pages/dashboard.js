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
  const [L, setL] = useState('');
  const [result, setResult] = useState({});
  const [basicData, setBasicData] = useState({});
  const router = useRouter();

  const calculateValues = () => {
    const V_아래_calculated = V_아래 ? Math.abs((V_아래 <= 180 ? 90 - V_아래 : 270 - V_아래)) : '';
    const V_위_calculated = V_위 ? Math.abs((V_위 <= 180 ? 90 - V_위 : 270 - V_위)) : '';
    
    if (V_아래 && V_위 && (H || L)) {
      const A = Math.abs(V_위_calculated - V_아래_calculated);
      const B = V_위_calculated;
      const C = V_아래_calculated;
      const D = (H_위 - H_아래);

      const A_rad = (A * Math.PI / 180);
      const B_rad = (B * Math.PI / 180);
      const C_rad = (C * Math.PI / 180);
      const D_rad = (D * Math.PI / 180);

      setBasicData({ A, B, C, D, A_rad, B_rad, C_rad, D_rad });

      let calculatedL = L;
      if (!L) {
        calculatedL = (H / (Math.tan(C_rad) - Math.tan(B_rad)));
      }
      
      const H1 = (calculatedL * Math.tan(C_rad));
      const E = (Math.sqrt(calculatedL ** 2 + H1 ** 2));
      const delta = (E * Math.tan(D_rad));
      const slope = (delta / H1);

      setResult({ L: calculatedL, H1, E, delta, slope });
    }
  };

  useEffect(() => {
    calculateValues();
  }, [V_아래, H_아래, V_위, H_위, H, L]);

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
      V_아래, H_아래, V_위, H_위, H, L,
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
    setL('');
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
              <td>L (m) 또는 H (m):</td>
              <td>
                <input 
                  type="number" 
                  value={L} 
                  onChange={(e) => {
                    setL(e.target.value);
                    if (e.target.value) {
                      setH('');
                    }
                  }} 
                  placeholder="L (m)" 
                  step="0.01" 
                />
                <input 
                  type="number" 
                  value={H} 
                  onChange={(e) => {
                    setH(e.target.value);
                    if (e.target.value) {
                      setL('');
                    }
                  }} 
                  placeholder="H (m)" 
                  step="0.01" 
                  disabled={L} // L값이 있을 때 비활성화
                />
              </td>
              <td>
                <button onClick={handleFieldReset(setL)} className={styles.resetButton}><FaRedoAlt /></button>
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
                <th colSpan="3">계산 데이터</th>
                <th colSpan="2">계산</th>
              </tr>
              <tr>
                <th>항목</th>
                <th>각도<br/>(도분법)</th>
                <th>각도<br/>(라디안)</th>
                <th>항목</th>
                <th>값</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A</td>
                <td>{Math.abs(basicData.A).toFixed(6)}</td>
                <td>{Math.abs(basicData.A_rad).toFixed(6)}</td>
                <td>L</td>
                <td>{Math.abs(result.L).toFixed(6)}</td>
              </tr>
              <tr>
                <td>B</td>
                <td>{Math.abs(basicData.B).toFixed(6)}</td>
                <td>{Math.abs(basicData.B_rad).toFixed(6)}</td>
                <td>H1</td>
                <td>{Math.abs(result.H1).toFixed(6)}</td>
              </tr>
              <tr>
                <td>C</td>
                <td>{Math.abs(basicData.C).toFixed(6)}</td>
                <td>{Math.abs(basicData.C_rad).toFixed(6)}</td>
                <td>E</td>
                <td>{Math.abs(result.E).toFixed(6)}</td>
              </tr>
              <tr>
                <td>D</td>
                <td>{Math.abs(basicData.D).toFixed(6)}</td>
                <td>{Math.abs(basicData.D_rad).toFixed(6)}</td>
                <td>δ</td>
                <td>{Math.abs(result.delta).toFixed(6)}</td>
              </tr>
              <tr>
                <td colSpan="4" className={styles.rightAlign}>기울기</td>
                <td>{Math.abs(result.slope).toFixed(6)}</td>
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
