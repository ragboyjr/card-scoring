import React, { ChangeEvent, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';

type Round = {
  number: number;
  phase: RoundPhase;
  playerRounds: PlayerRound[];
}

type RoundPhase = 'bidding' | 'playing' | 'finished';

type PlayerRound = {
  player: Player;
  position: number;
  bid: number | null;
  taken: number | null;
}

type RoundStats = {
  availableBids: number;
  totalBids: number;
}

function calculateRoundStats(round: Round): RoundStats {
  return {
    availableBids: round.number,
    totalBids: round.playerRounds.reduce((acc: number, value: PlayerRound) => acc + (value.bid || 0), 0),
  };
}

type CalculateScore = (p: PlayerRound) => number;

function addTenOrZeroCalculateScore(p: PlayerRound): number {
  const bid = p.bid || 0;
  const taken = p.taken || 0;

  if (p.taken === null) {
    return 0;
  }

  if (bid === taken) {
    return 10 + taken;
  }

  return 0;
}

function squareOrZeroCalculateScore(p: PlayerRound): number {
  const bid = p.bid || 0;
  const taken = p.taken || 0;

  if (p.taken === null) {
    return 0;
  }

  if (bid === taken) {
    return 10 + taken * taken;
  }

  return 0;
}

function tallyPlayerScore(rounds: Round[], player: Player, calcScore: CalculateScore): number {
  return rounds.reduce((currentScore, round) => {
    const pr = round.playerRounds.find(pr => pr.player == player)
    if (!pr) {
      throw 'Player round not found to score...';
    }

    return currentScore + calcScore(pr);
  }, 0);
}

function emptyRound(number: number, players: Player[]): Round {
  return {
    number: number,
    phase: 'bidding',
    playerRounds: players.map((p, index) => ({
      player: p,
      position: index,
      bid: null,
      taken: null,
    }))
  };
}

function nextRound(round: Round): Round {
  return {
    number: round.number + 1,
    phase: 'bidding',
    playerRounds: round.playerRounds.map(p => ({
      player: p.player,
      position: p.position === 0 ? round.playerRounds.length - 1 : p.position - 1,
      bid: null,
      taken: null,
    }))
  }
}

type Player = string;

function playerPosition(players: Player[], player: Player) {
  return players.indexOf(player) + 1;
}

type GameState = "setup" | "playing";

type GameSetupSectionProps = {
  addPlayer: (p: Player) => void;
  startGame: () => void;
};

function GameSetupSection(props: GameSetupSectionProps) {
  const [newPlayer, setNewPlayer] = useState('');

  function addPlayerFormHandler(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlayer) {
      return;
    }
    props.addPlayer(newPlayer);
    setNewPlayer('');
  }

  return <div className="row gx-2 justify-content-center">
    <div className='col-auto'>
      <form className="input-group" onSubmit={addPlayerFormHandler}>
        <input type="text" className="form-control" placeholder="Player Name" aria-label="Player Name" aria-describedby="button-addon2"
          value={newPlayer}
          onChange={e => setNewPlayer(e.currentTarget.value)} />
        <button className="btn btn-outline-secondary" type="submit" >Add Player</button>
      </form>
    </div>
    <div className='col-auto'>
      <button className='btn btn-primary' onClick={props.startGame}>Start Game</button>
    </div>
  </div>
}

type GamePlayingSectionProps = {
  newGame: () => void;
  playAgain: () => void;
  resetRound: () => void;
  addRoundValue: (number: number) => void;
  setScoreCalculator: (type: ScoreCalculatorType) => void;
  scoreCalculator: ScoreCalculatorType;
  currentRound: Round;
};
function GamePlayingSection(props: GamePlayingSectionProps) {
  const [value, setValue] = useState('');
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    if (!value) {
      setValue('');
      return;
    }

    if (Number.isNaN(parseInt(value, 10))) {
      setValue('');
      return;
    }

    setValue(value);
  }

  function formHandler(e: React.FormEvent) {
    e.preventDefault();
    if (!value) {
      return;
    }

    props.addRoundValue(parseInt(value, 10));
    setValue('');
  }

  function scoreSelectHandler(e: ChangeEvent<HTMLSelectElement>) {
    props.setScoreCalculator(e.currentTarget.value as ScoreCalculatorType);
  }

  return <div>
    <div className="row gx-2 justify-content-center mb-2">
      <div className='col-auto'>
        <button className='btn btn-outline' onClick={props.newGame}>New Game</button>
      </div>
      <div className='col-auto'>
        <button className='btn btn-outline' onClick={props.playAgain}>Play Again</button>
      </div>
      <div className='col-auto'>
        <select className="form-select" value={props.scoreCalculator} onChange={scoreSelectHandler}>
          <option value='ten-plus'>Add Ten + Bid</option>
          <option value="square-plus">Add Ten + Bid Squared</option>
        </select>
      </div>
    </div>
    <div className="row gx-2 justify-content-center">
      <div className='col-auto'>
        <form className="input-group" onSubmit={formHandler}>
          <input
            type="text"
            className="form-control"
            value={value}
            onChange={onChange} />
          <button className="btn btn-outline-secondary" type="submit">{props.currentRound.phase == "bidding" ? 'Add Bid' : 'Add Taken'}</button>
        </form>
      </div>
      <div className='col-auto'>
        <button className='btn btn-outline' onClick={props.resetRound}>Reset Round</button>
      </div>
    </div>
  </div>
}

function currentRound(rounds: Round[]) {
  return rounds[0];
}

function addValueToRound(round: Round, value: number): Round {
  if (round.phase == 'bidding') {
    return addBidToRound(round, value);
  }
  if (round.phase == 'playing') {
    return addTakenToRound(round, value);
  }

  return round;
}

function playerRoundsByPosition(playerRounds: PlayerRound[]): PlayerRound[] {
  return [...playerRounds].sort((a, b) => a.position - b.position);
}

function addBidToRound(round: Round, bid: number): Round {
  const playerRound = playerRoundsByPosition(round.playerRounds).find(p => p.bid == null);
  const newRound = {
    ...round,
    playerRounds: round.playerRounds.map((p) => {
      if (p.player != playerRound?.player) {
        return p;
      }

      return {...playerRound, bid: bid}
    })
  };

  return {
    ...newRound,
    phase: newRound.playerRounds.every(p => p.bid !== null) ? 'playing' : 'bidding'
  };
}

function addTakenToRound(round: Round, taken: number): Round {
  const playerRound = playerRoundsByPosition(round.playerRounds).find(p => p.taken == null);
  const newRound = {
    ...round,
    playerRounds: round.playerRounds.map((p) => {
      if (p.player != playerRound?.player) {
        return p;
      }

      return {...playerRound, taken: taken}
    })
  };

  return {
    ...newRound,
    phase: newRound.playerRounds.every(p => p.taken !== null) ? 'finished' : 'playing'
  };
}

function RoundStatsColumn(props: {round: Round}) {
  return <td>
    Round: {props.round.number}<br/>
    Total Bids: {calculateRoundStats(props.round).totalBids}
  </td>
}

function PlayerRoundColumn(props: {round: Round, playerRound: PlayerRound, total: number}) {
  return <td>
    Bid: {props.playerRound.bid === null ? 'N/A' : props.playerRound.bid}
    {props.round.phase === 'playing' ? <React.Fragment><br/>Taken: {props.playerRound.taken === null ? 'N/A' : props.playerRound.taken}</React.Fragment> : null}
    {props.round.phase === 'finished' ? <React.Fragment><br/>Total: {props.total}</React.Fragment> : null}
    {props.playerRound.position === 0 ? <React.Fragment><br/><span className="text-success fw-bold">Dealer</span></React.Fragment> : null}
  </td>
}

type ScoreCalculatorType = 'ten-plus' | 'square-plus';
function calculateScoreFromType(type: ScoreCalculatorType): CalculateScore {
  if (type == 'ten-plus') {
    return addTenOrZeroCalculateScore;
  }
  if (type == 'square-plus') {
    return squareOrZeroCalculateScore;
  }

  throw 'Unkown type';
}

// function calculateAllScores(rounds: Round[], calcScore: CalculateScore) {
//   rounds.reduce((acc, round: Round) => {
//     acc[round.number] = round.playerRounds.reduce((acc, playerRound: PlayerRound) => {
//       acc[playerRound.player] = calcScore()
//       return acc;
//     }, {});

//     return acc;
//   }, {});
// }

function OhHellGame() {
  const [gameState, setGameState] = useState<GameState>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [scoreCalculator, setScoreCalculator] = useState<ScoreCalculatorType>('square-plus');
  const calculateScore = calculateScoreFromType(scoreCalculator);

  // const scores = useMemo(() => {
  //   calculateAllScores(rounds, calculateScore);
  // }, [scoreCalculator, rounds]);

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
    return () => {
      setPlayers((players) => players.filter(p => p !== player))
    }
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
    {gameState == "setup" && <GameSetupSection addPlayer={addPlayer} startGame={startGame}/>}
    {gameState == "playing" && <GamePlayingSection newGame={newGame} playAgain={startGame} resetRound={resetRound} currentRound={currentRound(rounds)} addRoundValue={addToRound} setScoreCalculator={setScoreCalculator} scoreCalculator={scoreCalculator}/>}
    <table className="table">
      <thead>
        <tr>
          <th>&nbsp;</th>
          {players.map((player: Player) => (
            <th key={player}>{player} {gameState == "setup" && <React.Fragment>- <button className='btn btn-sm p-0 btn-link text-danger' onClick={removePlayer(player)}>Remove</button></React.Fragment>}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rounds.map((round, index) => (
          <tr key={round.number}>
            <RoundStatsColumn round={round}/>
            {round.playerRounds.map(pr => (
              <PlayerRoundColumn key={pr.player} round={round} playerRound={pr} total={tallyPlayerScore(rounds.slice(index), pr.player, calculateScore)} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
}

function App() {
  return <div className="container mx-auto">
    <OhHellGame/>
  </div>
}

export default App;
