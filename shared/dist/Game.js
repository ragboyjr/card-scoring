var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
export function playerPosition(players, player) {
    return players.indexOf(player) + 1;
}
export function playerRoundMadeBid(pr) {
    if (pr.bid === null || pr.taken === null) {
        return null;
    }
    return pr.bid === pr.taken ? "made" : "missed";
}
export function emptyRound(number, players) {
    return {
        number: number,
        phase: 'bidding',
        playerRounds: players.map(function (p, index) { return ({
            player: p,
            position: index,
            bid: null,
            taken: null,
        }); })
    };
}
export function nextRound(round) {
    return {
        number: round.number + 1,
        phase: 'bidding',
        playerRounds: round.playerRounds.map(function (p) { return ({
            player: p.player,
            position: p.position === 0 ? round.playerRounds.length - 1 : p.position - 1,
            bid: null,
            taken: null,
        }); })
    };
}
export function currentRound(rounds) {
    if (rounds[0] === undefined) {
        throw 'Could not retrieve current round.';
    }
    return rounds[0];
}
export function addValueToRound(round, value) {
    if (round.phase == 'bidding') {
        return addBidToRound(round, value);
    }
    if (round.phase == 'playing') {
        return addTakenToRound(round, value);
    }
    return round;
}
function playerRoundsByPosition(playerRounds) {
    return __spreadArray([], playerRounds, true).sort(function (a, b) { return a.position - b.position; });
}
function addBidToRound(round, bid) {
    var playerRound = playerRoundsByPosition(round.playerRounds).find(function (p) { return p.bid == null; });
    var newRound = __assign(__assign({}, round), { playerRounds: round.playerRounds.map(function (p) {
            if (p.player != (playerRound === null || playerRound === void 0 ? void 0 : playerRound.player)) {
                return p;
            }
            return __assign(__assign({}, playerRound), { bid: bid });
        }) });
    return __assign(__assign({}, newRound), { phase: newRound.playerRounds.every(function (p) { return p.bid !== null; }) ? 'playing' : 'bidding' });
}
function addTakenToRound(round, taken) {
    var playerRound = playerRoundsByPosition(round.playerRounds).find(function (p) { return p.taken == null; });
    var newRound = __assign(__assign({}, round), { playerRounds: round.playerRounds.map(function (p) {
            if (p.player != (playerRound === null || playerRound === void 0 ? void 0 : playerRound.player)) {
                return p;
            }
            return __assign(__assign({}, playerRound), { taken: taken });
        }) });
    return __assign(__assign({}, newRound), { phase: newRound.playerRounds.every(function (p) { return p.taken !== null; }) ? 'finished' : 'playing' });
}
export function calculateRoundStats(round) {
    return {
        availableBids: round.number,
        totalBids: round.playerRounds.reduce(function (acc, value) { return acc + (value.bid || 0); }, 0),
    };
}
function addTenOrZeroCalculateScore(p) {
    var bid = p.bid || 0;
    var taken = p.taken || 0;
    if (p.taken === null) {
        return 0;
    }
    if (bid === taken) {
        return 10 + taken;
    }
    return 0;
}
function squareOrZeroCalculateScore(p) {
    var bid = p.bid || 0;
    var taken = p.taken || 0;
    if (p.taken === null) {
        return 0;
    }
    if (bid === taken) {
        return 10 + taken * taken;
    }
    return 0;
}
export function tallyPlayerScore(rounds, player, calcScore) {
    return rounds.reduce(function (currentScore, round) {
        var pr = round.playerRounds.find(function (pr) { return pr.player == player; });
        if (!pr) {
            throw 'Player round not found to score...';
        }
        return currentScore + calcScore(pr);
    }, 0);
}
export function calculateScoreFromType(type) {
    if (type == 'ten-plus') {
        return addTenOrZeroCalculateScore;
    }
    if (type == 'square-plus') {
        return squareOrZeroCalculateScore;
    }
    throw 'Unkown type';
}
