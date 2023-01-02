export type Player = string;
export declare function playerPosition(players: Player[], player: Player): number;
export type PlayerRound = {
    player: Player;
    position: number;
    bid: number | null;
    taken: number | null;
};
export declare function playerRoundMadeBid(pr: PlayerRound): "made" | "missed" | null;
export type RoundPhase = 'bidding' | 'playing' | 'finished';
export type Round = {
    number: number;
    phase: RoundPhase;
    playerRounds: PlayerRound[];
};
export declare function emptyRound(number: number, players: Player[]): Round;
export declare function nextRound(round: Round): Round;
export declare function currentRound(rounds: Round[]): Round;
export declare function addValueToRound(round: Round, value: number): Round;
export type RoundStats = {
    availableBids: number;
    totalBids: number;
};
export declare function calculateRoundStats(round: Round): RoundStats;
export type CalculateScore = (p: PlayerRound) => number;
export declare function tallyPlayerScore(rounds: Round[], player: Player, calcScore: CalculateScore): number;
export type ScoreCalculatorType = 'ten-plus' | 'square-plus';
export declare function calculateScoreFromType(type: ScoreCalculatorType): CalculateScore;
export type GameState = "setup" | "playing" | "wow";
//# sourceMappingURL=Game.d.ts.map