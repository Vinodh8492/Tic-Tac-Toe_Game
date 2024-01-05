// Win.jsx
import React from 'react';
import styles from './Win.module.css';
import { useNavigate } from 'react-router-dom';

function Lose({ onPlayAgain }) {
  return (
    <div className={styles.container}>
      <p>YOU Lost</p>
      <h2>CHOICE TAKES THE ROUND</h2>
      <div className={styles.button}>
        <button className={styles.btn1} onClick={onPlayAgain}>QUIT</button>
        
        <button className={styles.btn2} >
          NEXT ROUND 
        </button>
      </div>
    </div>
  );
}

export default Lose;
