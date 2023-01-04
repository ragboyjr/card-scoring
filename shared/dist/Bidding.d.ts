import { Player } from "./Game";
export type Bid = number | null;
export type Direction = "up" | "down";
export type PlayerBids = Record<Player, Bid>;
export declare function emptyBidsForPlayers(players: Player[]): PlayerBids;
export declare function allBidsSet(bids: PlayerBids): boolean;
export declare function allBidsSumToAvailableBids(availableBids: number, bids: PlayerBids): boolean;
export declare function changeBid(bids: PlayerBids, player: Player, direction: Direction): PlayerBids;
//# sourceMappingURL=Bidding.d.ts.map