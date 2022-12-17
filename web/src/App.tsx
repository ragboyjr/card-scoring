import React, { ChangeEvent, useMemo, useState } from 'react';
import './App.css';
import {
  Player,

  Round,
  currentRound,
  addValueToRound,
  emptyRound,
  nextRound,
} from './Game';

import { GamePlayingSection } from './GamePlay';
import { GameSetupSection } from './GameSetup';

export type GameState = "setup" | "playing";

function OhHellGame() {
  const [gameState, setGameState] = useState<GameState>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);

  function startGame() {
    if (players.length === 0) {
      return;
    }
    setGameState("playing");
    setRounds([emptyRound(1, players)]);
  }
  function newGame() {
    setGameState("setup");
    setPlayers([]);
    setRounds([]);
  }
  function addPlayer(newPlayer: Player) {
    setPlayers((players) => [...players.filter(p => p !== newPlayer), newPlayer])
  }
  function removePlayer(player: Player) {
    setPlayers((players) => players.filter(p => p !== player))
  }

  function resetRound() {
    setRounds((rounds) => {
      if (rounds.length === 1) {
        return [emptyRound(1, players)];
      }

      return [nextRound(rounds[1]), ...rounds.slice(1)];
    })
  }

  function addToRound(value: number) {
    setRounds((rounds) => {
      const round = addValueToRound(currentRound(rounds), value);
      return round.phase === 'finished'
        ? [nextRound(round), round, ...rounds.slice(1)]
        : [round, ...rounds.slice(1)];
    })
  }

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
