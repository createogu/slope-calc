// src/components/Layout.js
import React from 'react';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const [user] = useAuthState(auth);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <ul>
            <li><Link href="/dashboard">Dashboard</Link></li>
            {user && <li className={styles.userName}>Hello, {user.email}</li>}
          </ul>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Your Company</p>
      </footer>
    </div>
  );
};

export default Layout;
