import React, { useEffect, useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Player, RoundInput } from "../types/game";

interface RoundEntryProps {
  players: Player[];
  dropScore: number;
  middleDropScore: number;
  onSubmit: (scores: RoundInput) => void;
}

export function RoundEntry({ players, dropScore, middleDropScore, onSubmit }: RoundEntryProps) {
  const [entries, setEntries] = useState<Record<string, string>>({});

  useEffect(() => {
    const init: Record<string, string> = {};
    players.forEach((player) => {
      init[player.id] = "0";
    });
    setEntries(init);
  }, [players]);

  const activePlayers = useMemo(() => players.filter((p) => !p.isKnockedOut), [players]);

  const updateEntry = (playerId: string, value: string) => {
    setEntries((prev) => ({
      ...prev,
      [playerId]: value.replace(/[^0-9]/g, ""),
    }));
  };

  const setPreset = (playerId: string, score: number) => {
    setEntries((prev) => ({
      ...prev,
      [playerId]: String(score),
    }));
  };

  const submitRound = () => {
    const payload: RoundInput = {};

    players.forEach((player) => {
      if (player.isKnockedOut) {
        payload[player.id] = 0;
        return;
      }

      const parsed = Number(entries[player.id] ?? 0);
      payload[player.id] = Number.isNaN(parsed) ? 0 : parsed;
    });

    onSubmit(payload);

    const reset: Record<string, string> = {};
    players.forEach((player) => {
      reset[player.id] = "0";
    });
    setEntries(reset);
  };

  return (
    <View className="rounded-2xl bg-white p-4 shadow-card">
      <Text className="mb-3 text-base font-semibold text-slate-900">Round Entry</Text>

      <View className="gap-3">
        {players.map((player) => {
          const disabled = player.isKnockedOut;

          return (
            <View key={player.id} className="rounded-xl border border-slate-200 p-3">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className={`font-semibold ${disabled ? "text-slate-400 line-through" : "text-slate-900"}`}>
                  {player.name}
                </Text>
                {disabled && <Text className="text-xs font-semibold text-red-600">Knocked Out</Text>}
              </View>

              <View className="flex-row items-center gap-2">
                <TextInput
                  className={`flex-1 rounded-xl border px-3 py-2 text-base ${
                    disabled ? "border-slate-200 bg-slate-100 text-slate-400" : "border-slate-300 text-slate-900"
                  }`}
                  editable={!disabled}
                  keyboardType="number-pad"
                  value={entries[player.id] ?? "0"}
                  onChangeText={(text) => updateEntry(player.id, text)}
                />
                <TouchableOpacity
                  className={`rounded-lg px-3 py-2 ${disabled ? "bg-slate-200" : "bg-amber-100"}`}
                  disabled={disabled}
                  onPress={() => setPreset(player.id, dropScore)}
                >
                  <Text className={`text-xs font-semibold ${disabled ? "text-slate-400" : "text-amber-800"}`}>
                    Drop
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`rounded-lg px-3 py-2 ${disabled ? "bg-slate-200" : "bg-orange-100"}`}
                  disabled={disabled}
                  onPress={() => setPreset(player.id, middleDropScore)}
                >
                  <Text className={`text-xs font-semibold ${disabled ? "text-slate-400" : "text-orange-800"}`}>
                    Middle
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        className={`mt-4 rounded-xl px-4 py-3 ${activePlayers.length > 0 ? "bg-brand-500" : "bg-slate-300"}`}
        disabled={activePlayers.length === 0}
        onPress={submitRound}
      >
        <Text className="text-center font-semibold text-white">Add Round</Text>
      </TouchableOpacity>
    </View>
  );
}
