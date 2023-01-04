import React, { useState } from 'react';
import { GameApi, Player, ScoreCalculatorType, calculateScoreFromType } from '@card-scoring/shared/Game';
import { Button, TextInput, View, Text, ButtonProps } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type GameActionsProps = Pick<GameApi, "newGame" | "startGame"> & {
  scoreCalculator: ScoreCalculatorType;
  setScoreCalculator: (value: React.SetStateAction<ScoreCalculatorType>) => void;
};

function GameActions(props: GameActionsProps) {
  const [open, setOpen] = useState(false);

  function GameButton(props: {title: string, onPress: ButtonProps['onPress'] }) {
    return <View style={{flex: 1}}>
      <Button title={props.title} onPress={props.onPress} />
    </View>
  }

  return <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
    <GameButton title='New Game' onPress={props.newGame}/>
    <GameButton title='Play Again' onPress={props.startGame}/>
    <View style={{flex: 1.5, paddingHorizontal: 8}}>
      <DropDownPicker
        open={open}
        value={props.scoreCalculator}
        items={[
          {label: 'Add Ten + Bid', value: 'ten-plus'},
          {label: 'Add Ten + Bid Squared', value: 'square-plus'},
        ]}
        setOpen={setOpen}
        setValue={props.setScoreCalculator}
      />
    </View>
  </View>
}

type GamePlayingSectionProps = Pick<GameApi, "newGame" | "startGame" | "resetRound" | "addToRound" | "rounds">;
export function GamePlayingSection(props: GamePlayingSectionProps) {
  const [scoreCalculator, setScoreCalculator] = useState<ScoreCalculatorType>('square-plus');
  const calculateScore = calculateScoreFromType(scoreCalculator);

  return <View>
    <GameActions {...props} {...{scoreCalculator, setScoreCalculator}} />
  </View>
}