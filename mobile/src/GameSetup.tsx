import React, { useState } from 'react';
import { GameApi, Player } from '@card-scoring/shared/Game';
import { Button, TextInput, View, Text } from 'react-native';

type GameSetupSectionProps = Pick<GameApi, "addPlayer" | "removePlayer" | "startGame" | "players">;
export function GameSetupSection(props: GameSetupSectionProps) {
  const [newPlayer, setNewPlayer] = useState('');

  function addPlayerFormHandler() {
    if (!newPlayer) {
      return;
    }
    props.addPlayer(newPlayer);
    setNewPlayer('');
  }

  return <View>
    <View style={{flexDirection: 'row', marginTop: 4, paddingHorizontal: 8, alignItems: 'center'}}>
      <TextInput style={{height: 40, borderWidth: 1, borderRadius: 4, flex: 1, paddingHorizontal: 8, marginRight: 8}}
        enablesReturnKeyAutomatically={true}
        blurOnSubmit={false}
        returnKeyType={'next'}
        value={newPlayer}
        onChangeText={setNewPlayer}
        onSubmitEditing={addPlayerFormHandler}
        />
      <Button title='Add' onPress={addPlayerFormHandler}/>
      <Button title='Start Game' onPress={props.startGame}/>
    </View>
    <View style={{flexDirection: 'row', marginTop: 8, justifyContent: 'space-evenly', flexWrap: 'wrap'}}>
      {props.players.map((player: Player) => (
        <View key={player} style={{marginTop: 8}}>
          <Text style={{textAlign: 'center', fontSize: 16, fontWeight: '600'}}>{player}</Text>
          <Button title='Remove' onPress={() => props.removePlayer(player)}/>
        </View>
      ))}
    </View>
  </View>
}