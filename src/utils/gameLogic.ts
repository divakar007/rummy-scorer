import { Player, RoundScores } from "../types/game";

export function checkKnockout(totalScore: number, limit: number): boolean {
  return totalScore > limit;
}

export function calculateMoneyDistribution(
  players: Player[],
  moneyPerGame: number,
  totalScoreLimit: number
): Record<string, number> {
  const activePlayers = players.filter((p) => !p.isKnockedOut);
  
  // Total money in the pool
  const totalMoney = moneyPerGame * players.length;

  // If no active players or moneyPerGame is 0, return 0 for all
  if (activePlayers.length === 0 || moneyPerGame === 0) {
    const distribution: Record<string, number> = {};
    players.forEach((player) => {
      distribution[player.id] = 0;
    });
    return distribution;
  }

  // Calculate money based on ratio: (totalScoreLimit - currentScore)
  // Higher remaining score buffer = higher reward
  const scoreWeights: Record<string, number> = {};
  let totalWeight = 0;

  activePlayers.forEach((player) => {
    // Weight based on how much room they have before knockout
    const weight = Math.max(0, totalScoreLimit - player.totalScore);
    scoreWeights[player.id] = weight;
    totalWeight += weight;
  });

  // Distribute money based on weights
  const distribution: Record<string, number> = {};
  
  // Initialize all players with 0
  players.forEach((player) => {
    distribution[player.id] = 0;
  });
  
  // If total weight is 0, distribute equally among active players
  if (totalWeight === 0) {
    const equalShare = totalMoney / activePlayers.length;
    activePlayers.forEach((player) => {
      distribution[player.id] = equalShare;
    });
  } else {
    // Distribute money based on weights (score buffer ratio)
    activePlayers.forEach((player) => {
      const weight = scoreWeights[player.id];
      distribution[player.id] = (weight / totalWeight) * totalMoney;
    });
  }

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
  const moneyDistribution = calculateMoneyDistribution(updatedPlayers, moneyPerGame, totalLimit);

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
