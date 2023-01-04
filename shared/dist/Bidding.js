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
export function emptyBidsForPlayers(players) {
    return players.reduce(function (acc, player) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[player] = null, _a)));
    }, {});
}
export function allBidsSet(bids) {
    return !Object.entries(bids).some(function (_a) {
        var k = _a[0], v = _a[1];
        return v === null;
    });
}
export function allBidsSumToAvailableBids(availableBids, bids) {
    return availableBids === Object.values(bids).map(function (i) { return i || 0; }).reduce(function (acc, i) { return acc + i; }, 0);
}
export function changeBid(bids, player, direction) {
    var _a;
    var currentBid = bids[player] || 0;
    var newBid = Math.max(0, direction === "up" ? currentBid + 1 : currentBid - 1);
    return __assign(__assign({}, bids), (_a = {}, _a[player] = newBid, _a));
}
