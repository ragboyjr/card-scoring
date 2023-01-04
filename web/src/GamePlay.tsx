import React, { ChangeEvent, useState } from 'react';
import {
  Player,
  Round,
  currentRound,
  calculateRoundStats,

  PlayerRound,
  playerRoundMadeBid,

  ScoreCalculatorType,
  calculateScoreFromType,
  CalculateScore,
  tallyPlayerScore,
} from '@card-scoring/shared/Game';

import { useBiddingApi } from '@card-scoring/shared/hooks';

function RoundValuesSection(props: {currentRound: Round, resetRound: () => void, addRoundValue: (number: number) => void}) {
  const biddingApi = useBiddingApi(props.currentRound, props.addRoundValue)
  return <>
    <div className="row gx-2 justify-content-center mt-2">
      {biddingApi.allPlayers.map(player => <div className='col-4 col-sm-3' key={player}>
        <div className="text-center">{player}</div>
        <form className="input-group" onSubmit={e => e.preventDefault()}>
          <button className="btn btn-outline-secondary" type="button" onClick={() => biddingApi.changeBid(player, "down")}>-</button>
          <input
            type="text"
            className="form-control text-center"
            readOnly
            value={biddingApi.bids[player] === null ? '_' : (biddingApi.bids[player] || 0)}
          />
          <button className="btn btn-outline-secondary" type="button" onClick={() => biddingApi.changeBid(player, "up")}>+</button>
        </form>
      </div>)}
    </div>
    <div className="row gx-2 justify-content-center mt-2">
      {props.currentRound.phase !== "bidding" && <div className='col-auto'>
        <button className='btn btn-danger' onClick={props.resetRound}>Reset Round</button>
      </div>}
      <div className='col-auto'>
        <button className='btn btn-success' onClick={biddingApi.finishBiddingTaking} disabled={!biddingApi.canFinishBiddingTaking()}>
          {props.currentRound.phase === "bidding" ? 'Bid' : 'Finish'}
        </button>
      </div>
    </div>
  </>
}

function RoundStatsColumn(props: {round: Round}) {
  return <div className='col-auto'>
    Round: {props.round.number}<br/>
    Total Bids: {calculateRoundStats(props.round).totalBids}
  </div>
}

function SeperatedRoundValues(props: {text: string[]}) {
    if (!props.text.length) {
        return null;
    }

    return <React.Fragment>
      {props.text[0]}
      {props.text.slice(1).map((t, i) => <React.Fragment key={i}><span className="mx-1">/</span>{t}</React.Fragment>)}
    </React.Fragment>
}

function WrapMadeBidStatus(props: {children: React.ReactNode, playerRound: PlayerRound }) {
  const madeBid = playerRoundMadeBid(props.playerRound);
  if (madeBid === null) {
    return <>{props.children}</>;
  }

  return <span className={"fw-bold " + (madeBid === "made" ? 'text-success' : 'text-danger')}>
    {props.children}
  </span>
}

type TallyPlayerScore = (p: Player) => number;

function PlayerRoundsColumn(props: {round: Round, tallyScore: TallyPlayerScore}) {
  return <div className='col'>
    <div className='row gx-2'>
      {props.round.playerRounds.map((playerRound) => <div className='col-auto mb-2'>
        <span className={"fw-bold " + (playerRound.position === 0 ? 'text-info' : '')}>{playerRound.player}: </span>
        <WrapMadeBidStatus playerRound={playerRound}>
          <SeperatedRoundValues text={[
              playerRound.bid === null ? '_' : playerRound.bid.toString(),
              playerRound.taken === null ? '_' : playerRound.taken.toString(),
              props.round.phase !== 'finished' ? '_' : props.tallyScore(playerRound.player).toString(),
          ]}/>
        </WrapMadeBidStatus>
      </div>)}
    </div>
  </div>
}

function RoundList(props: {rounds: Round[], calculateScore: CalculateScore}) {
  return <div className='mt-4'>
    {props.rounds.map((round, index) => <div key={round.number} className='row gx-3 border-top pt-2'>
      <RoundStatsColumn round={round}/>
      <PlayerRoundsColumn round={round} tallyScore={(p: Player) => tallyPlayerScore(props.rounds.slice(index), p, props.calculateScore)}/>
    </div>)}
  </div>
}

type GameActionsProps = {
  newGame: () => void;
  playAgain: () => void;
  scoreCalculator: ScoreCalculatorType;
  setScoreCalculator: (value: React.SetStateAction<ScoreCalculatorType>) => void;
};

function GameActions(props: GameActionsProps) {
  function scoreSelectHandler(e: ChangeEvent<HTMLSelectElement>) {
    props.setScoreCalculator(e.currentTarget.value as ScoreCalculatorType);
  }

  return <div className="row gx-2 justify-content-center mb-2">
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
  </div>;
}

type GamePlayingSectionProps = {
  newGame: () => void;
  playAgain: () => void;
  resetRound: () => void;
  addRoundValue: (number: number) => void;
  rounds: Round[];
};

export function GamePlayingSection(props: GamePlayingSectionProps) {
  const [scoreCalculator, setScoreCalculator] = useState<ScoreCalculatorType>('square-plus');
  const calculateScore = calculateScoreFromType(scoreCalculator);

  return <div>
    <GameActions newGame={props.newGame} playAgain={props.playAgain} scoreCalculator={scoreCalculator} setScoreCalculator={setScoreCalculator}/>
    <RoundValuesSection currentRound={currentRound(props.rounds)} addRoundValue={props.addRoundValue} resetRound={props.resetRound} />
    <RoundList rounds={props.rounds} calculateScore={calculateScore}/>
  </div>
}