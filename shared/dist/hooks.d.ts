import { GameApi, Player, Round, RoundStats } from './Game.js';
import * as Bidding from './Bidding.js';
export type BiddingApi = {
    changeBid: (player: Player, direction: Bidding.Direction) => void;
    canFinishBiddingTaking: () => boolean;
    finishBiddingTaking: () => void;
    roundStats: RoundStats;
    allPlayers: Player[];
    bids: Bidding.PlayerBids;
};
export declare function useBiddingApi(currentRound: Round, addToRound: GameApi['addToRound']): BiddingApi;
export declare function useGameApi(): GameApi;
//# sourceMappingURL=hooks.d.ts.map