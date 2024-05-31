import { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../app/firebase';
import { useRouter } from 'next/router';

export default function Admin() {
  const [user, loading, error] = useAuthState(auth);
  const [calculations, setCalculations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/');
      return;
    }
    // 관리자 이메일을 검사하여 비관리자 접근 차단
    if (user.email !== 'admin@example.com') {
      router.push('/dashboard');
      return;
    }

    const fetchCalculations = async () => {
      const querySnapshot = await getDocs(collection(db, 'calculations'));
      const calcData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCalculations(calcData);
    };

    fetchCalculations();
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container">
      <h1>관리자 페이지</h1>
      <h2>모든 계산 이력</h2>
      <table>
        <thead>
          <tr>
            <th>사용자 ID</th>
            <th>제목</th>
            <th>계산 날짜</th>
            <th>L (m)</th>
            <th>H1 (m)</th>
            <th>E (m)</th>
            <th>δ (m)</th>
            <th>기울기</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {calculations.map((calc) => (
            <tr key={calc.id}>
              <td>{calc.userId}</td>
              <td>{calc.title}</td>
              <td>{new Date(calc.date).toLocaleString()}</td>
              <td>{calc.L.toFixed(4)}</td>
              <td>{calc.H1.toFixed(4)}</td>
              <td>{calc.E.toFixed(4)}</td>
              <td>{calc.delta.toFixed(4)}</td>
              <td>{calc.slope.toFixed(4)}</td>
              <td>
                <button onClick={() => router.push(`/edit/${calc.id}`)}>수정</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
