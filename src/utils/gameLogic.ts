import { Player, RoundScores } from "../types/game";

export function checkKnockout(totalScore: number, limit: number): boolean {
  return totalScore > limit;
}

export function calculateTotals(
  players: Player[],
  roundHistory: RoundScores[],
  totalLimit: number
): Player[] {
  return players.map((player) => {
    const scores = roundHistory.map((round) => round[player.id] ?? 0);
    const totalScore = scores.reduce((sum, value) => sum + value, 0);

    return {
      ...player,
      scores,
      totalScore,
      isKnockedOut: checkKnockout(totalScore, totalLimit),
    };
  });
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
