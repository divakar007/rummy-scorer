import React, { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGame } from "../context/GameContext";

const PLAYER_MIN = 2;
const PLAYER_MAX = 8;

export function GameSetupScreen() {
  const { startGame } = useGame();

  const [playerCountText, setPlayerCountText] = useState("2");
  const [playerNames, setPlayerNames] = useState<string[]>(["Player 1", "Player 2"]);
  const [totalScoreLimit, setTotalScoreLimit] = useState("201");
  const [dropScore, setDropScore] = useState("25");
  const [middleDropScore, setMiddleDropScore] = useState("40");

  const playerCount = useMemo(() => {
    const parsed = Number(playerCountText);
    if (Number.isNaN(parsed)) return PLAYER_MIN;
    return Math.min(PLAYER_MAX, Math.max(PLAYER_MIN, Math.floor(parsed)));
  }, [playerCountText]);

  const updatePlayerCount = (value: string) => {
    setPlayerCountText(value.replace(/[^0-9]/g, ""));

    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;

    const nextCount = Math.min(PLAYER_MAX, Math.max(PLAYER_MIN, Math.floor(parsed)));

    setPlayerNames((prev) => {
      const next = [...prev];
      while (next.length < nextCount) {
        next.push(`Player ${next.length + 1}`);
      }
      return next.slice(0, nextCount);
    });
  };

  const updatePlayerName = (index: number, value: string) => {
    setPlayerNames((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  };

  const canStart =
    playerNames.length >= PLAYER_MIN &&
    playerNames.every((name) => name.trim().length > 0) &&
    Number(totalScoreLimit) > 0 &&
    Number(dropScore) >= 0 &&
    Number(middleDropScore) >= 0;

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
      <View className="mx-auto w-full max-w-4xl gap-4">
        <Text className="text-3xl font-bold text-slate-900">Rummy Scorer</Text>
        <Text className="text-base text-slate-600">Create a game and start tracking rounds.</Text>

        <View className="rounded-2xl bg-white p-4 shadow-card">
          <Text className="mb-2 text-sm font-semibold text-slate-700">Number of Players</Text>
          <TextInput
            className="rounded-xl border border-slate-200 px-3 py-2 text-base text-slate-900"
            keyboardType="number-pad"
            value={playerCountText}
            onChangeText={updatePlayerCount}
            placeholder="2"
          />
          <Text className="mt-2 text-xs text-slate-500">Allowed range: {PLAYER_MIN}-{PLAYER_MAX}</Text>
        </View>

        <View className="rounded-2xl bg-white p-4 shadow-card">
          <Text className="mb-3 text-sm font-semibold text-slate-700">Player Names</Text>
          <View className="gap-2">
            {Array.from({ length: playerCount }).map((_, index) => (
              <TextInput
                key={index}
                className="rounded-xl border border-slate-200 px-3 py-2 text-base text-slate-900"
                value={playerNames[index] ?? ""}
                onChangeText={(text) => updatePlayerName(index, text)}
                placeholder={`Player ${index + 1}`}
              />
            ))}
          </View>
        </View>

        <View className="rounded-2xl bg-white p-4 shadow-card">
          <Text className="mb-3 text-sm font-semibold text-slate-700">Game Rules</Text>
          <View className="gap-3">
            <View>
              <Text className="mb-1 text-xs text-slate-500">Total game score</Text>
              <TextInput
                className="rounded-xl border border-slate-200 px-3 py-2 text-base text-slate-900"
                keyboardType="number-pad"
                value={totalScoreLimit}
                onChangeText={(text) => setTotalScoreLimit(text.replace(/[^0-9]/g, ""))}
              />
            </View>
            <View>
              <Text className="mb-1 text-xs text-slate-500">Drop score</Text>
              <TextInput
                className="rounded-xl border border-slate-200 px-3 py-2 text-base text-slate-900"
                keyboardType="number-pad"
                value={dropScore}
                onChangeText={(text) => setDropScore(text.replace(/[^0-9]/g, ""))}
              />
            </View>
            <View>
              <Text className="mb-1 text-xs text-slate-500">Middle drop score</Text>
              <TextInput
                className="rounded-xl border border-slate-200 px-3 py-2 text-base text-slate-900"
                keyboardType="number-pad"
                value={middleDropScore}
                onChangeText={(text) => setMiddleDropScore(text.replace(/[^0-9]/g, ""))}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          className={`rounded-2xl px-4 py-3 ${canStart ? "bg-brand-500" : "bg-slate-300"}`}
          disabled={!canStart}
          onPress={() => {
            startGame(playerNames.slice(0, playerCount), {
              totalScoreLimit: Number(totalScoreLimit),
              dropScore: Number(dropScore),
              middleDropScore: Number(middleDropScore),
            });
          }}
        >
          <Text className="text-center text-base font-semibold text-white">Start Game</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
