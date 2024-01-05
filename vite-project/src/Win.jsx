import React from 'react';
import styles from './Win.module.css';
import { useNavigate } from 'react-router-dom';

function Win({ result, onPlayAgain, onRestartGame, userChoice, computerChoice }) {
  const navigate = useNavigate();

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
    // Call the onPlayAgain prop, which is the refreshButton function from App2
    onPlayAgain();
  };

  const renderReview = () => {
    if (result === 'win') {
      return (
        <h2 className={styles.review}>
          <span className={userChoice === 'X' ? styles.userX : styles.userO}>
            {userChoice}
          </span>{' '}
          TAKES THE ROUND
        </h2>
      );
    } else if (result === 'lose') {
      return (
        <h2 className={styles.review}>
          <span className={computerChoice === 'X' ? styles.computerX : styles.computerO}>
            {computerChoice}
          </span>{' '}
          TAKES THE ROUND
        </h2>
      );
    } else {
      return null; // Don't render the line in case of a tie
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
      {renderReview()}
      <div className={styles.button}>
        <button className={styles.btn1} onClick={handlePlayAgain}>
          QUIT
        </button>

        <button className={styles.btn2} onClick={handleNextRound}>
          NEXT GAME
        </button>
      </div>
    </div>
  );
}

export default Win;
