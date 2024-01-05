import React, { createContext, useContext, useState } from 'react';

const GameStateContext = createContext();

export const useGameState = () => {
  return useContext(GameStateContext);
};

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    refreshGame: false,
  });

  const refreshGame = () => {
    setGameState((prevState) => ({
      ...prevState,
      refreshGame: !prevState.refreshGame,
    }));
  };

  return (
    <GameStateContext.Provider value={{ gameState, refreshGame }}>
      {children}
    </GameStateContext.Provider>
  );
};
