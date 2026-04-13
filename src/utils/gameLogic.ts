import { Player, RoundScores } from "../types/game";

export function checkKnockout(totalScore: number, limit: number): boolean {
  return totalScore > limit;
}

export function calculateMoneyDistribution(
  players: Player[],
  moneyPerGame: number
): Record<string, number> {
  const activePlayers = players.filter((p) => !p.isKnockedOut);
  
  if (activePlayers.length === 0) {
    return {};
  }

  // Total money in the pool
  const totalMoney = moneyPerGame * players.length;

  // Calculate money based on inverse of scores (lower score = higher reward)
  const maxScore = Math.max(...activePlayers.map((p) => p.totalScore));
  const scoreWeights: Record<string, number> = {};
  let totalWeight = 0;

  activePlayers.forEach((player) => {
    // Use inverse weight: higher score = lower weight
    const weight = maxScore - player.totalScore + 1;
    scoreWeights[player.id] = weight;
    totalWeight += weight;
  });

  // Distribute money based on weights
  const distribution: Record<string, number> = {};
  activePlayers.forEach((player) => {
    const weight = scoreWeights[player.id];
    distribution[player.id] = (weight / totalWeight) * totalMoney;
  });

  return distribution;
}

export function calculateTotals(
  players: Player[],
  roundHistory: RoundScores[],
  totalLimit: number,
  moneyPerGame: number = 0
): Player[] {
  const updatedPlayers = players.map((player) => {
    const scores = roundHistory.map((round) => round[player.id] ?? 0);
    const totalScore = scores.reduce((sum, value) => sum + value, 0);

    return {
      ...player,
      scores,
      totalScore,
      isKnockedOut: checkKnockout(totalScore, totalLimit),
    };
  });

  // Calculate money distribution
  const moneyDistribution = calculateMoneyDistribution(updatedPlayers, moneyPerGame);

  return updatedPlayers.map((player) => ({
    ...player,
    moneyWon: moneyDistribution[player.id] ?? 0,
  }));
}

export function updateRoundScore(
  roundHistory: RoundScores[],
  roundIndex: number,
  playerId: string,
  newScore: number
): RoundScores[] {
  return roundHistory.map((round, index) => {
    if (index !== roundIndex) {
      return round;
    }

    return {
      ...round,
      [playerId]: newScore,
    };
  });
}
