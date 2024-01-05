// App2.jsx

import React, { useState, useEffect } from 'react';
import styles from './App2.module.css';
import Finish from './Finish'; // Import the Finish component

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

function App2({key, userChoice, onGameResult, onGameComplete, resetGame, replayGame }) {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [advice, setAdvice] = useState('');
  const [showFinish, setShowFinish] = useState(false);

  

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const response = await fetch('https://api.adviceslip.com/advice');
        const data = await response.json();
        setAdvice(data.slip.advice);
      } catch (error) {
        console.error('Error fetching advice:', error);
      }
    };
    fetchAdvice();

    const intervalId = setInterval(fetchAdvice, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // New state for counters with initial values from local storage
  const [userWins, setUserWins] = useState(() => parseInt(localStorage.getItem('userWins')) || 0);
  const [computerWins, setComputerWins] = useState(() => parseInt(localStorage.getItem('computerWins')) || 0);
  const [ties, setTies] = useState(() => parseInt(localStorage.getItem('ties')) || 0);




  
  const userSymbol = userChoice || 'X';
  const computerSymbol = userSymbol === 'X' ? 'O' : 'X' ;
  useEffect(() => {
    
    if (!isUserTurn && !winner) {
      const computerMoveTimeout = setTimeout(() => {
        makeComputerMove();
      }, 500);

      return () => clearTimeout(computerMoveTimeout);
    }
  }, [isUserTurn, winner]);


  const handleBoxClick = (index) => {
    if (board[index] || !isUserTurn || winner) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = userSymbol;
    setBoard(newBoard);

    checkWinner(newBoard);
    setIsUserTurn(false);

    
  };

  const makeComputerMove = () => {
    const emptyBoxes = board.reduce((acc, value, i) => (value === null ? [...acc, i] : acc), []);

    if (emptyBoxes.length === 0 || winner) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
    const computerMove = emptyBoxes[randomIndex];

    const newBoard = [...board];
    newBoard[computerMove] = computerSymbol;
    setBoard(newBoard);

    checkWinner(newBoard);
    setIsUserTurn(true);
  };

  const checkWinner = (currentBoard) => {
    let isTie = true;

    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        setWinner(currentBoard[a]);
        onGameResult(currentBoard[a] === userSymbol ? 'win' : 'lose');

        // Update counters after game completion
        if (currentBoard[a] === userSymbol) {
          setUserWins((prev) => {
            const newUserWins = prev + 1;
            localStorage.setItem('userWins', newUserWins.toString());
            return newUserWins;
          });
        } else {
          setComputerWins((prev) => {
            const newComputerWins = prev + 1;
            localStorage.setItem('computerWins', newComputerWins.toString());
            return newComputerWins;
          });
        }

        return;
      }
    }

    for (const value of currentBoard) {
      if (value === null) {
        isTie = false;
        break;
      }
    }

    if (isTie) {
      setWinner('TIE');
      onGameResult('tie');

      // Update ties counter after game completion
      setTies((prev) => {
        const newTies = prev + 1;
        localStorage.setItem('ties', newTies.toString());
        return newTies;
      });
      <Win/>
    }

    // Notify the parent component that the game is complete
    onGameComplete();
  };

  const renderBox = (value, index) => (
    <div className={styles.boxes} key={index} onClick={() => handleBoxClick(index)}>
      {value === 'X' && (
      <p className={userSymbol === 'X' ? styles.userChoice : styles.computerChoice}>X</p>
    )}
    {value === 'O' && (
      <p className={userSymbol === 'O' ? styles.userChoice : styles.computerChoice}>O</p>
    )}
    </div>
  );

  const restartGame = (freshStart) => {
    setBoard(freshStart ? initialBoard : initialBoard);
    setWinner(null);
    setIsUserTurn(true);
    resetGame();
  };

  const refreshButton = () => {
    setShowFinish(true);
    
  };
  const cancelFinish = () => {
    setShowFinish(false);
    onGameComplete(); // Notify the parent component that the game is complete
  };

  return (
    <>
      {showFinish && (
        <Finish
          result={winner}
          onPlayAgain={() => resetGame()}
          onRestartGame={() => replayGame()}
          onCancel={cancelFinish}
          
        />
      )}

      <div className={styles.container}>
        <div className={styles.small}>
          <h2 className={styles.quote}> Quote #2</h2>
          <h3 className={styles.suggest}>"{<span key={advice}>{advice}</span>}"</h3>
        </div>

        <div className={styles.container1}>
          <div className={styles.start}>
            <div className={styles.beginning} ><font color='aqua'>X</font>O</div>
            <div className={styles.begin}>{isUserTurn ? `${userSymbol} Turn` : `${computerSymbol} Turn`}</div>
            <div className={styles.begin1} onClick={refreshButton}>
            <img className={styles.img} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-26g8sHLlKrN22isL8F5b8mrT02-9BLOOaiu6_xLX3nA2TvSGoIvtUnPzRFLcbgDW7WQ&usqp=CAU'/>
            </div>
          </div>

          <div className={styles.board}>
            <div className={styles.first}>
              {board.slice(0, 3).map((value, index) => renderBox(value, index))}
            </div>
            <div className={styles.second}>
              {board.slice(3, 6).map((value, index) => renderBox(value, index + 3))}
            </div>
            <div className={styles.third}>
              {board.slice(6, 9).map((value, index) => renderBox(value, index + 6))}
            </div>
          </div>

          <div className={styles.last}>
            <div className={styles.box1}>
              <p>{userSymbol} (YOU)</p> {userWins}
            </div>
            <div className={styles.box2}>
              <p>{winner === 'TIE' ? 'TIES' : 'TIE'}</p> {ties}
            </div>
            <div className={styles.box3}>
              <p>{computerSymbol} (CPU)</p> {computerWins}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App2;
