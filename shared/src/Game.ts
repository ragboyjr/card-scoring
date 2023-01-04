// Player
export type Player = string;
export function playerPosition(players: Player[], player: Player) {
  return players.indexOf(player) + 1;
}

export type PlayerRound = {
  player: Player;
  position: number;
  bid: number | null;
  taken: number | null;
}
export function playerRoundMadeBid(pr: PlayerRound): "made"|"missed"|null {
  if (pr.bid === null || pr.taken === null) {
    return null;
  }

  return pr.bid === pr.taken ? "made" : "missed";
}

// Rounds
export type RoundPhase = 'bidding' | 'playing' | 'finished';
export type Round = {
  number: number;
  phase: RoundPhase;
  playerRounds: PlayerRound[];
}
export function emptyRound(number: number, players: Player[]): Round {
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
export function nextRound(round: Round): Round {
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
export function currentRound(rounds: Round[]): Round {
  if (rounds[0] === undefined) {
    throw 'Could not retrieve current round.';
  }

  return rounds[0];
}
export function addValueToRound(round: Round, value: number): Round {
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

export type RoundStats = {
  availableBids: number;
  totalBids: number;
}
export function calculateRoundStats(round: Round): RoundStats {
  return {
    availableBids: round.number,
    totalBids: round.playerRounds.reduce((acc: number, value: PlayerRound) => acc + (value.bid || 0), 0),
  };
}

// Score Calculation
export type CalculateScore = (p: PlayerRound) => number;
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
export function tallyPlayerScore(rounds: Round[], player: Player, calcScore: CalculateScore): number {
  return rounds.reduce((currentScore, round) => {
    const pr = round.playerRounds.find(pr => pr.player == player)
    if (!pr) {
      throw 'Player round not found to score...';
    }

    return currentScore + calcScore(pr);
  }, 0);
}
export type ScoreCalculatorType = 'ten-plus' | 'square-plus';
export function calculateScoreFromType(type: ScoreCalculatorType): CalculateScore {
  if (type == 'ten-plus') {
    return addTenOrZeroCalculateScore;
  }
  if (type == 'square-plus') {
    return squareOrZeroCalculateScore;
  }

  throw 'Unkown type';
}

export type GameState = "setup" | "playing" | "wow";

export type GameApi = {
  gameState: GameState;
  players: Player[];
  rounds: Round[];
  startGame: () => void;
  newGame: () => void;
  addPlayer: (newPlayer: Player) => void;
  removePlayer: (player: Player) => void;
  resetRound: () => void;
  addToRound: (value: number) => void;
};