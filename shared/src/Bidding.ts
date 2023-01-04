import { Player } from "./Game";

export type Bid = number | null;
export type Direction = "up" | "down";
export type PlayerBids = Record<Player, Bid>;

export function emptyBidsForPlayers(players: Player[]): PlayerBids {
  return players.reduce((acc, player) => ({...acc, ...{[player]: null}}), {});
}

export function allBidsSet(bids: PlayerBids): boolean {
  return !Object.entries(bids).some(([k, v]) => v === null);
}

export function allBidsSumToAvailableBids(availableBids: number, bids: PlayerBids): boolean {
  return availableBids === Object.values(bids).map(i => i || 0).reduce((acc, i) => acc + i, 0);
}

export function changeBid(bids: PlayerBids, player: Player, direction: Direction): PlayerBids {
  const currentBid = bids[player] || 0;
  const newBid = Math.max(0, direction === "up" ? currentBid + 1 : currentBid - 1);
  return {...bids, ...{[player]: newBid}};
}