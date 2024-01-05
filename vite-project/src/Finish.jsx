// Finish.jsx
import React, { useState } from 'react';
import styles from './Finish.module.css';

function Finish({ result, onPlayAgain, onRestartGame, onCancel }) {
  const [showCancel, setShowCancel] = useState(true);

  let message = '';

  switch (result) {
    case 'win':
      message = 'YOU WON!';
      break;
    case 'lose':
      message = 'YOU LOST!';
      break;
    case 'tie':
      message = 'IT\'S A TIE!';
      break;
    default:
      message = 'Game over';
  }

  const handleNextRound = () => {
    onRestartGame();
  };

  const handlePlayAgain = () => {
    onPlayAgain();
  };

  const handleCancel = () => {
    onCancel();
    setShowCancel(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.winOverlay}>
        <div className={styles.container}>
          {showCancel && (
            <div className={styles.cancelButton} onClick={handleCancel}>
              X
            </div>
          )}
          <h2 className={styles.review}>Do you want to quit ?</h2>
          <div className={styles.button}>
            <button className={styles.btn2} onClick={handleNextRound}>
              PLAY AGAIN
            </button>
            <button className={styles.btn1} onClick={handlePlayAgain}>
              QUIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Finish;
