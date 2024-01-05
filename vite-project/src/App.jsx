import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import { useNavigate } from 'react-router-dom';
import App2 from './App2.jsx';
import Win from './Win';
import Finish from './Finish';

function App() {
  const navigate = useNavigate();
  const [showGameContent, setShowGameContent] = useState(false);
  const [userChoice, setUserChoice] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [advice, setAdvice] = useState('');
  const [showFinish, setShowFinish] = useState(false);
  const [buttonBackground, setButtonBackground] = useState({ 'X': 'transparent', 'O': 'transparent' });
  const [userWins, setUserWins] = useState(() => parseInt(localStorage.getItem('userWins')) || 0);
  const [computerWins, setComputerWins] = useState(() => parseInt(localStorage.getItem('computerWins')) || 0);
  const [ties, setTies] = useState(() => parseInt(localStorage.getItem('ties')) || 0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [buttonTextColor, setButtonTextColor] = useState({ 'X': 'black', 'O': 'black' });
  const [showInvitationCode, setShowInvitationCode] = useState(false);
  const [winner, setWinner] = useState(null);
  const [app2Key, setApp2Key] = useState(0);
  const [unselectedButton, setUnselectedButton] = useState(null);
  const resetScores = () => {
    setUserWins(0);
    setComputerWins(0);
    setTies(0);

    // Persist the changes to local storage
    localStorage.setItem('userWins', '0');
    localStorage.setItem('computerWins', '0');
    localStorage.setItem('ties', '0');
  };
  useEffect(() => {
    const savedGame = JSON.parse(localStorage.getItem('ticTacToeGame'));

    if (savedGame) {
      setUserChoice(savedGame.userChoice);
      setGameResult(savedGame.gameResult);
      setAdvice(savedGame.advice);
      setShowGameContent(savedGame.showGameContent);
      setButtonBackground(savedGame.buttonBackground);
      setUserWins(savedGame.userWins);
      setComputerWins(savedGame.computerWins);
      setTies(savedGame.ties);
      setButtonClicked(savedGame.buttonClicked);
      setSelectedButton(savedGame.selectedButton);
      setUnselectedButton(savedGame.unselectedButton)
      setButtonTextColor(savedGame.buttonTextColor);
      setShowInvitationCode(savedGame.showInvitationCode);
      setWinner(savedGame.winner);
    } else {
      fetchAdvice(); // Fetch advice if no saved game is found
    }

    const intervalId = setInterval(fetchAdvice, 10000);

    return () => clearInterval(intervalId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const saveGame = () => {
      const gameToSave = {
        userChoice,
        gameResult,
        advice,
        showGameContent,
        buttonBackground,
        userWins,
        computerWins,
        ties,
        buttonClicked,
        selectedButton,
        unselectedButton,
        buttonTextColor,
        showInvitationCode,
        winner,
      };

      localStorage.setItem('ticTacToeGame', JSON.stringify(gameToSave));
    };

    saveGame();
  }, [
    userChoice,
    gameResult,
    advice,
    showGameContent,
    buttonBackground,
    userWins,
    computerWins,
    ties,
    buttonClicked,
    selectedButton,
    buttonTextColor,
    showInvitationCode,
    winner,
  ]);

  const fetchAdvice = async () => {
    try {
      const response = await fetch('https://api.adviceslip.com/advice');
      const data = await response.json();
      setAdvice(data.slip.advice);
    } catch (error) {
      console.error('Error fetching advice:', error);
    }
  };

  const changePage = (choice) => {
    setUserChoice(choice);
    setSelectedButton(choice);
    setButtonTextColor(prevColors => ({ ...prevColors, [choice]: 'black' }));
    setButtonBackground((prevBackground) => {
      const newBackground = { 'X': 'transparent', 'O': 'transparent' };
      newBackground[choice] = 'white';
      return newBackground;
    });
    setButtonClicked(true);
  };

  const startGame = () => {
    if (selectedButton) {
      setShowGameContent(true);
      setButtonBackground({ 'X': 'transparent', 'O': 'transparent' });
    } else {
      console.error('Please select a player (X or O) before starting the game.');
    }
  };

  const handleGameResult = (result) => {
    setGameResult(result);

    if (result === 'win') {
      setUserWins((prev) => {
        const newUserWins = prev + 1;
        localStorage.setItem('userWins', newUserWins.toString());
        return newUserWins;
      });
    } else if (result === 'lose') {
      setComputerWins((prev) => {
        const newComputerWins = prev + 1;
        localStorage.setItem('computerWins', newComputerWins.toString());
        setUnselectedButton(selectedButton === 'X' ? 'O' : 'X');
        return newComputerWins;
      });
    } else if (result === 'tie') {
      setTies((prev) => {
        const newTies = prev + 1;
        localStorage.setItem('ties', newTies.toString());
        return newTies;
      });
    }
  };

  const handleGameComplete = () => {
    setUserChoice(null);
    setGameResult(null);
  };

  const resetGame = () => {
    localStorage.removeItem('ticTacToeGame');
    // Reset scores to zero when resetting the game
    resetScores(); 

    setUserChoice(null);
    setShowGameContent(false);
    setGameResult(null);
    setWinner(null);
    setSelectedButton(null);
  };

  const renewGame = () => {
    setUserChoice(null);
    setGameResult(null);
    setWinner(null);
    setButtonBackground({ 'X': 'transparent', 'O': 'transparent' });
    setShowGameContent(false);

    // Increment the key to force re-render of App2 component
    setApp2Key((prevKey) => prevKey + 1);
    setShowGameContent(true);
    
  };

  const replayGame = () => {
    localStorage.removeItem('ticTacToeGame');
    resetScores(); 
    setUserChoice(null);
    setShowGameContent(false);
    setApp2Key((prevKey) => prevKey + 1);
    setShowGameContent(true);
    setGameResult(null);
    setWinner(null);
    setButtonBackground({ 'X': 'transparent', 'O': 'transparent' });
    
  };

  const handleInviteFriend = () => {
    setShowInvitationCode(true);

    setTimeout(() => {
      setShowInvitationCode(false);
    }, 5000);
  };

  return (
    <div className={styles.container}>
      {!showGameContent && (
        <div className={styles.small}>
          <h2 className={styles.quote}> Quote #1</h2>
          <h3 className={styles.suggest}> "{<span key={advice}>{advice}</span>}" </h3>
        </div>
      )}

      {!showGameContent && (
        <div className={styles.container1}>
          <div className={styles.xo}>
            <h1 className={styles.x}> X </h1> <h1 className={styles.o}>O</h1>
          </div>
          <div className={styles.doublecon}>
            <h3 className={styles.pickplayer}>PICK PLAYER</h3>
            <div className={styles.buttons}>
              <button style={{ backgroundColor: buttonBackground['X'], color: buttonTextColor['X'] }} className={styles.xbutton} onClick={() => changePage('X')}>X</button>
              <button style={{ backgroundColor: buttonBackground['O'], color: buttonTextColor['O'] }} className={styles.obutton} onClick={() => changePage('O')}>O</button>
            </div>
          </div>
          <button onClick={startGame} className={styles.newgame}>
            NEW GAME (VS CPU)
          </button>
          <button className={styles.comingsoon}>NEW GAME (VS HUMAN) Coming Soon</button> <br />
          <button onClick={handleInviteFriend} className={styles.invite}>Invite your friend</button>
        </div>
      )}

      {showGameContent && (
        <App2
        key={app2Key} 
          userChoice={selectedButton}
          onGameResult={handleGameResult}
          onGameComplete={handleGameComplete}
          resetGame={resetGame}  
          replayGame={replayGame} 
        />
      )}

      {gameResult && (
        <div className={styles.overlay}>
          <div className={styles.winOverlay}>
            <Win result={gameResult} userChoice={selectedButton} computerChoice={unselectedButton} onPlayAgain={resetGame}  onRestartGame={renewGame} />
          </div>
        </div>
      )}

      {showFinish && (
        <Finish onPlayAgain={resetGame} onRestartGame={replayGame} />
      )}
      {showInvitationCode && (
        <div className={styles.invitationCode}>
          <button className={styles.copyButton}>Invitation Code Copied !</button>
        </div>
      )}
    </div>
  );
}

export default App;