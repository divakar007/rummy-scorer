import React from "react";
import { Text, View } from "react-native";
import { Player } from "../types/game";

interface PlayerCardProps {
  player: Player;
  highestScore: number;
}

export function PlayerCard({ player, highestScore }: PlayerCardProps) {
  const isHighest = player.totalScore === highestScore && highestScore > 0;

  return (
    <View className="min-w-[160px] flex-1 rounded-2xl bg-white p-4 shadow-card">
      <View className="mb-2 flex-row items-center justify-between">
        <Text
          className={`text-base font-semibold ${player.isKnockedOut ? "text-red-700 line-through" : "text-slate-900"}`}
          numberOfLines={1}
        >
          {player.name}
        </Text>
        {player.isKnockedOut && (
          <View className="rounded-full bg-red-100 px-2 py-1">
            <Text className="text-[10px] font-semibold text-red-700">KNOCKED OUT</Text>
          </View>
        )}
      </View>

      <Text className={`text-4xl font-bold ${isHighest ? "text-red-600" : "text-slate-900"}`}>
        {player.totalScore}
      </Text>
      <Text className="mt-1 text-xs text-slate-500">Total Score</Text>
    </View>
  );
}
