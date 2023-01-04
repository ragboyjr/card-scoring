import React from 'react';
import './App.css';
import { useGameApi } from '@card-scoring/shared/hooks';

import { GamePlayingSection } from './GamePlay';
import { GameSetupSection } from './GameSetup';

function OhHellGame() {
  const {
    gameState,
    players,
    rounds,
    startGame,
    newGame,
    addPlayer,
    removePlayer,
    resetRound,
    addToRound,
  } = useGameApi();

  return <div>
    <h1 className="mt-2 text-center">Oh Hell</h1>
    {gameState == "setup" && <GameSetupSection addPlayer={addPlayer} startGame={startGame} players={players} removePlayer={removePlayer} />}
    {gameState == "playing" && <GamePlayingSection newGame={newGame} playAgain={startGame} resetRound={resetRound} addRoundValue={addToRound} rounds={rounds} />}
  </div>
}

function App() {
  return <div className="container mx-auto">
    <OhHellGame/>
  </div>
}

export default App;
