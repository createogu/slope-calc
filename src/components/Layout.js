// src/components/Layout.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase'; // 경로 수정
import { signOut } from 'firebase/auth';
import Modal from 'react-modal';
import styles from './Layout.module.css';

Modal.setAppElement('#__next'); // Next.js에서 사용하기 위해 설정

const Layout = ({ children }) => {
  const [user] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {user && (
          <nav className={styles.nav}>
            <ul>
              <li><Link href="/dashboard">계산기</Link></li>
              <li><Link href="/history">계산결과</Link></li>
              <li className={styles.userName} onClick={() => setIsModalOpen(true)}>
                반갑다, {user.email}
              </li>
            </ul>
          </nav>
        )}
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>&copy; 2024 오물개 제작</p>
      </footer>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>로그아웃하시겠습니까?</h2>
        <button onClick={handleLogout}>로그아웃</button>
        <button onClick={() => setIsModalOpen(false)}>취소</button>
      </Modal>
    </div>
  );
};

export default Layout;
