import "react-native-get-random-values";
import "./global.css";

import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { GameProvider, useGame } from "./src/context/GameContext";
import { GameScreen } from "./src/screens/GameScreen";
import { GameSetupScreen } from "./src/screens/GameSetupScreen";

function RootNavigator() {
  const { state } = useGame();

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <StatusBar barStyle="dark-content" />
      {state.isStarted ? <GameScreen /> : <GameSetupScreen />}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <GameProvider>
      <RootNavigator />
    </GameProvider>
  );
}
