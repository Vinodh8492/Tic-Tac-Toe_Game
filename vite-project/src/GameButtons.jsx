// GameButtons.jsx
import React from 'react';
import styles from './GameButtons.module.css';

function GameButtons({ onPlayAgain, onRestartGame }) {
  return (
    <div className={styles.button}>
      <button className={styles.btn1} onClick={onPlayAgain}>
        QUIT
      </button>
      <button className={styles.btn2} onClick={onRestartGame}>
        PLAY AGAIN
      </button>
    </div>
  );
}

export default GameButtons;
