import React, { useState } from 'react';
import { Player } from '@card-scoring/shared/Game';

type GameSetupSectionProps = {
  addPlayer: (p: Player) => void;
  removePlayer: (p: Player) => void;
  startGame: () => void;
  players: Player[];
};

export function GameSetupSection(props: GameSetupSectionProps) {
  const [newPlayer, setNewPlayer] = useState('');

  function addPlayerFormHandler(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlayer) {
      return;
    }
    props.addPlayer(newPlayer);
    setNewPlayer('');
  }

  return <>
    <div className="row gx-2 justify-content-center">
      <div className='col-auto mb-2'>
        <form className="input-group" onSubmit={addPlayerFormHandler}>
          <input type="text" className="form-control" placeholder="Player Name" aria-label="Player Name" aria-describedby="button-addon2"
            value={newPlayer}
            onChange={e => setNewPlayer(e.currentTarget.value)} />
          <button className="btn btn-outline-secondary" type="submit" >Add Player</button>
        </form>
      </div>
      <div className='col-auto mb-2'>
        <button className='btn btn-primary' onClick={props.startGame}>Start Game</button>
      </div>
    </div>
    <div className="row gx-2 justify-content-center">
      {props.players.map((player: Player) => (
        <div key={player} className="col-3 col-sm-auto">
          {player}<br/>
          <button className='btn btn-sm p-0 btn-link text-danger' onClick={() => props.removePlayer(player)}>Remove</button>
        </div>
      ))}
    </div>
  </>;
}