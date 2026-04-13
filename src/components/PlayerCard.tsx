import React from "react";
import { Text, View } from "react-native";
import { Player } from "../types/game";
import { getCurrencySymbol } from "../utils/currencies";
import type { Currency } from "../types/game";

interface PlayerCardProps {
  player: Player;
  highestScore: number;
  currency: Currency;
}

export function PlayerCard({ player, highestScore, currency }: PlayerCardProps) {
  const isHighest = player.totalScore === highestScore && highestScore > 0;
  const currencySymbol = getCurrencySymbol(currency);

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

      <View className="mt-3 rounded-lg bg-emerald-50 px-2 py-2">
        <Text className="text-xs text-emerald-600">Money Won</Text>
        <Text className="text-2xl font-bold text-emerald-700">
          {currencySymbol}{(player.moneyWon ?? 0).toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
