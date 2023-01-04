var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState } from 'react';
import { addValueToRound, currentRound, emptyRound, nextRound, calculateRoundStats } from './Game.js';
import * as Bidding from './Bidding.js';
export function useBiddingApi(currentRound, addToRound) {
    var allPlayers = currentRound.playerRounds.map(function (pr) { return pr.player; });
    var _a = useState(Bidding.emptyBidsForPlayers(allPlayers)), bids = _a[0], setBids = _a[1];
    var roundStats = calculateRoundStats(currentRound);
    function changeBid(player, direction) {
        setBids(function (bids) { return Bidding.changeBid(bids, player, direction); });
    }
    function canFinishBiddingTaking() {
        return (currentRound.phase === "bidding" && Bidding.allBidsSet(bids))
            || (currentRound.phase === "playing" && Bidding.allBidsSumToAvailableBids(roundStats.availableBids, bids));
    }
    function finishBiddingTaking() {
        if (!canFinishBiddingTaking()) {
            return;
        }
        for (var _i = 0, allPlayers_1 = allPlayers; _i < allPlayers_1.length; _i++) {
            var player = allPlayers_1[_i];
            addToRound(bids[player] || 0);
        }
        if (currentRound.phase !== "bidding") {
            setBids(Bidding.emptyBidsForPlayers(allPlayers));
        }
    }
    return {
        changeBid: changeBid,
        canFinishBiddingTaking: canFinishBiddingTaking,
        finishBiddingTaking: finishBiddingTaking,
        roundStats: roundStats,
        allPlayers: allPlayers,
        bids: bids,
    };
}
;
export function useGameApi() {
    var _a = useState("setup"), gameState = _a[0], setGameState = _a[1];
    var _b = useState([]), players = _b[0], setPlayers = _b[1];
    var _c = useState([]), rounds = _c[0], setRounds = _c[1];
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
    function addPlayer(newPlayer) {
        setPlayers(function (players) { return __spreadArray(__spreadArray([], players.filter(function (p) { return p !== newPlayer; }), true), [newPlayer], false); });
    }
    function removePlayer(player) {
        setPlayers(function (players) { return players.filter(function (p) { return p !== player; }); });
    }
    function resetRound() {
        setRounds(function (rounds) {
            if (rounds.length <= 1) {
                return [emptyRound(1, players)];
            }
            if (rounds[1] === undefined) {
                throw 'Previous round not found.';
            }
            return __spreadArray([nextRound(rounds[1])], rounds.slice(1), true);
        });
    }
    function addToRound(value) {
        setRounds(function (rounds) {
            var round = addValueToRound(currentRound(rounds), value);
            return round.phase === 'finished'
                ? __spreadArray([nextRound(round), round], rounds.slice(1), true) : __spreadArray([round], rounds.slice(1), true);
        });
    }
    return {
        gameState: gameState,
        players: players,
        rounds: rounds,
        startGame: startGame,
        newGame: newGame,
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        resetRound: resetRound,
        addToRound: addToRound
    };
}
