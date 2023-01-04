import { useState } from 'react';
import { GameApi, GameState, Player, Round, addValueToRound, currentRound, emptyRound, nextRound, calculateRoundStats, RoundStats } from './Game.js';
import * as Bidding from './Bidding.js';

export type BiddingApi = {
  changeBid: (player: Player, direction: Bidding.Direction) => void;
  canFinishBiddingTaking: () => boolean;
  finishBiddingTaking: () => void;
  roundStats: RoundStats,
  allPlayers: Player[];
  bids: Bidding.PlayerBids;
};
export function useBiddingApi(currentRound: Round, addToRound: GameApi['addToRound']): BiddingApi {
  const allPlayers = currentRound.playerRounds.map(pr => pr.player);
  const [bids, setBids] = useState<Bidding.PlayerBids>(Bidding.emptyBidsForPlayers(allPlayers));
  const roundStats = calculateRoundStats(currentRound);

  function changeBid(player: Player, direction: Bidding.Direction) {
    setBids((bids) => Bidding.changeBid(bids, player, direction));
  }

  function canFinishBiddingTaking(): boolean {
    return (currentRound.phase === "bidding" && Bidding.allBidsSet(bids))
      || (currentRound.phase === "playing" && Bidding.allBidsSumToAvailableBids(roundStats.availableBids, bids));
  }

  function finishBiddingTaking() {
    if (!canFinishBiddingTaking()) {
      return;
    }

    for (let player of allPlayers) {
      addToRound(bids[player] || 0);
    }

    if (currentRound.phase !== "bidding") {
      setBids(Bidding.emptyBidsForPlayers(allPlayers));
    }
  }

  return {
    changeBid,
    canFinishBiddingTaking,
    finishBiddingTaking,
    roundStats,
    allPlayers,
    bids,
  };
};

export function useGameApi(): GameApi {
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
      if (rounds.length <= 1) {
        return [emptyRound(1, players)];
      }

      if (rounds[1] === undefined) {
        throw 'Previous round not found.';
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

  return {
    gameState,
    players,
    rounds,
    startGame,
    newGame,
    addPlayer,
    removePlayer,
    resetRound,
    addToRound
  };
}