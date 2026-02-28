import React, { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PlayerCard } from "../components/PlayerCard";
import { RoundEntry } from "../components/RoundEntry";
import { useGame } from "../context/GameContext";

export function GameScreen() {
  const { state, addRound, updateRoundScores, deleteRound, resetGame, newGame } = useGame();

  const [editingRound, setEditingRound] = useState<number | null>(null);
  const [draftScores, setDraftScores] = useState<Record<string, string>>({});

  const highestScore = useMemo(
    () => Math.max(0, ...state.players.map((player) => player.totalScore)),
    [state.players]
  );

  const startEditingRound = (roundIndex: number) => {
    const round = state.roundHistory[roundIndex];
    const draft: Record<string, string> = {};

    state.players.forEach((player) => {
      draft[player.id] = String(round[player.id] ?? 0);
    });

    setDraftScores(draft);
    setEditingRound(roundIndex);
  };

  const saveRoundEdits = () => {
    if (editingRound === null) return;

    const parsed: Record<string, number> = {};
    state.players.forEach((player) => {
      const value = Number(draftScores[player.id] ?? 0);
      parsed[player.id] = Number.isNaN(value) ? 0 : value;
    });

    updateRoundScores(editingRound, parsed);
    setEditingRound(null);
    setDraftScores({});
  };

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
      <View className="mx-auto w-full max-w-6xl gap-4">
        <View className="rounded-2xl bg-white p-4 shadow-card">
          <Text className="text-lg font-bold text-slate-900">Current Game</Text>
          <View className="mt-2 flex-row flex-wrap gap-3">
            <View className="rounded-xl bg-slate-100 px-3 py-2">
              <Text className="text-xs text-slate-500">Total Score Limit</Text>
              <Text className="text-sm font-semibold text-slate-900">{state.config.totalScoreLimit}</Text>
            </View>
            <View className="rounded-xl bg-slate-100 px-3 py-2">
              <Text className="text-xs text-slate-500">Drop</Text>
              <Text className="text-sm font-semibold text-slate-900">{state.config.dropScore}</Text>
            </View>
            <View className="rounded-xl bg-slate-100 px-3 py-2">
              <Text className="text-xs text-slate-500">Middle Drop</Text>
              <Text className="text-sm font-semibold text-slate-900">{state.config.middleDropScore}</Text>
            </View>
            <View className="ml-auto flex-row gap-2">
              <TouchableOpacity className="rounded-xl bg-red-100 px-3 py-2" onPress={resetGame}>
                <Text className="text-sm font-semibold text-red-700">Reset Game</Text>
              </TouchableOpacity>
              <TouchableOpacity className="rounded-xl bg-slate-900 px-3 py-2" onPress={newGame}>
                <Text className="text-sm font-semibold text-white">New Game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-3">
          {state.players.map((player) => (
            <PlayerCard key={player.id} player={player} highestScore={highestScore} />
          ))}
        </View>

        <RoundEntry
          players={state.players}
          dropScore={state.config.dropScore}
          middleDropScore={state.config.middleDropScore}
          onSubmit={addRound}
        />

        <View className="rounded-2xl bg-white p-4 shadow-card">
          <Text className="mb-3 text-base font-semibold text-slate-900">Round History</Text>
          {state.roundHistory.length === 0 ? (
            <Text className="text-sm text-slate-500">No rounds added yet.</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View className="mb-2 flex-row border-b border-slate-200 pb-2">
                  <Text className="w-20 text-xs font-semibold text-slate-500">Round</Text>
                  {state.players.map((player) => (
                    <Text key={player.id} className="w-24 text-xs font-semibold text-slate-500">
                      {player.name}
                    </Text>
                  ))}
                  <Text className="w-36 text-xs font-semibold text-slate-500">Actions</Text>
                </View>

                {state.roundHistory.map((round, roundIndex) => {
                  const isEditing = editingRound === roundIndex;

                  return (
                    <View key={roundIndex} className="mb-2 flex-row items-center border-b border-slate-100 pb-2">
                      <Text className="w-20 text-sm font-semibold text-slate-700">#{roundIndex + 1}</Text>

                      {state.players.map((player) => (
                        <View key={player.id} className="w-24 pr-2">
                          {isEditing ? (
                            <TextInput
                              className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                              keyboardType="number-pad"
                              value={draftScores[player.id] ?? "0"}
                              onChangeText={(text) =>
                                setDraftScores((prev) => ({
                                  ...prev,
                                  [player.id]: text.replace(/[^0-9]/g, ""),
                                }))
                              }
                            />
                          ) : (
                            <Text className="text-sm text-slate-800">{round[player.id] ?? 0}</Text>
                          )}
                        </View>
                      ))}

                      <View className="w-36 flex-row gap-2">
                        {isEditing ? (
                          <>
                            <TouchableOpacity className="rounded-lg bg-emerald-100 px-2 py-1" onPress={saveRoundEdits}>
                              <Text className="text-xs font-semibold text-emerald-800">Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="rounded-lg bg-slate-200 px-2 py-1"
                              onPress={() => {
                                setEditingRound(null);
                                setDraftScores({});
                              }}
                            >
                              <Text className="text-xs font-semibold text-slate-700">Cancel</Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <>
                            <TouchableOpacity
                              className="rounded-lg bg-sky-100 px-2 py-1"
                              onPress={() => startEditingRound(roundIndex)}
                            >
                              <Text className="text-xs font-semibold text-sky-800">Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="rounded-lg bg-red-100 px-2 py-1"
                              onPress={() => deleteRound(roundIndex)}
                            >
                              <Text className="text-xs font-semibold text-red-700">Delete</Text>
                            </TouchableOpacity>
                          </>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
