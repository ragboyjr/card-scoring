/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {type PropsWithChildren, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
// import { emptyRound, GameState, Player, currentRound, addValueToRound, nextRound, Round } from '../web/src/Game';

import {
  Colors,
  DebugInstructions,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  Player,

  Round,
  currentRound,
  addValueToRound,
  emptyRound,
  nextRound,

  GameState
} from '@card-scoring/shared/Game';

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

// function OhHellGame() {
//   const [gameState, setGameState] = useState<GameState>("setup");
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [rounds, setRounds] = useState<Round[]>([]);

//   function startGame() {
//     if (players.length === 0) {
//       return;
//     }
//     setGameState("playing");
//     setRounds([emptyRound(1, players)]);
//   }
//   function newGame() {
//     setGameState("setup");
//     setPlayers([]);
//     setRounds([]);
//   }
//   function addPlayer(newPlayer: Player) {
//     setPlayers((players) => [...players.filter(p => p !== newPlayer), newPlayer])
//   }
//   function removePlayer(player: Player) {
//     setPlayers((players) => players.filter(p => p !== player))
//   }

//   function resetRound() {
//     setRounds((rounds) => {
//       if (rounds.length === 1) {
//         return [emptyRound(1, players)];
//       }

//       return [nextRound(rounds[1]), ...rounds.slice(1)];
//     })
//   }

//   function addToRound(value: number) {
//     setRounds((rounds) => {
//       const round = addValueToRound(currentRound(rounds), value);
//       return round.phase === 'finished'
//         ? [nextRound(round), round, ...rounds.slice(1)]
//         : [round, ...rounds.slice(1)];
//     })
//   }

//   return <div>
//     <h1 className="mt-2 text-center">Oh Hell</h1>
//     {gameState == "setup" && <GameSetupSection addPlayer={addPlayer} startGame={startGame} players={players} removePlayer={removePlayer} />}
//     {gameState == "playing" && <GamePlayingSection newGame={newGame} playAgain={startGame} resetRound={resetRound} addRoundValue={addToRound} rounds={rounds} />}
//   </div>
// }


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Section title="First Section">
        This is great: {emptyRound(1, []).phase}
      </Section>


      {/* <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
