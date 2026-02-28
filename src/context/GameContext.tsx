import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { calculateTotals } from "../utils/gameLogic";
import { GameConfig, GameState, Player, RoundInput, RoundScores } from "../types/game";

const STORAGE_KEY = "rummy_scorer_state_v1";

const defaultState: GameState = {
  players: [],
  rounds: 0,
  config: {
    totalScoreLimit: 201,
    dropScore: 25,
    middleDropScore: 40,
  },
  roundHistory: [],
  isStarted: false,
};

interface GameContextValue {
  state: GameState;
  startGame: (playerNames: string[], config: GameConfig) => void;
  addRound: (roundInput: RoundInput) => void;
  updateRoundScores: (roundIndex: number, updatedScores: RoundInput) => void;
  deleteRound: (roundIndex: number) => void;
  resetGame: () => void;
  newGame: () => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as GameState;
          setState(parsed);
        }
      } catch (error) {
        console.warn("Failed to load saved game state", error);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((error) => {
      console.warn("Failed to save game state", error);
    });
  }, [state, hydrated]);

  const recomputePlayers = (
    basePlayers: Player[],
    history: RoundScores[],
    config: GameConfig
  ): Player[] => calculateTotals(basePlayers, history, config.totalScoreLimit);

  const startGame = (playerNames: string[], config: GameConfig) => {
    const players: Player[] = playerNames
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({
        id: uuidv4(),
        name,
        scores: [],
        totalScore: 0,
        isKnockedOut: false,
      }));

    const nextState: GameState = {
      players,
      rounds: 0,
      config,
      roundHistory: [],
      isStarted: true,
    };

    setState(nextState);
  };

  const addRound = (roundInput: RoundInput) => {
    setState((prev) => {
      const newHistory = [...prev.roundHistory, roundInput];
      const players = recomputePlayers(prev.players, newHistory, prev.config);

      return {
        ...prev,
        players,
        roundHistory: newHistory,
        rounds: newHistory.length,
      };
    });
  };

  const updateRoundScores = (roundIndex: number, updatedScores: RoundInput) => {
    setState((prev) => {
      const newHistory = prev.roundHistory.map((round, idx) => {
        if (idx !== roundIndex) {
          return round;
        }

        return {
          ...round,
          ...updatedScores,
        };
      });

      const players = recomputePlayers(prev.players, newHistory, prev.config);

      return {
        ...prev,
        players,
        roundHistory: newHistory,
      };
    });
  };

  const deleteRound = (roundIndex: number) => {
    setState((prev) => {
      const newHistory = prev.roundHistory.filter((_, idx) => idx !== roundIndex);
      const players = recomputePlayers(prev.players, newHistory, prev.config);

      return {
        ...prev,
        players,
        roundHistory: newHistory,
        rounds: newHistory.length,
      };
    });
  };

  const resetGame = () => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((player) => ({
        ...player,
        scores: [],
        totalScore: 0,
        isKnockedOut: false,
      })),
      rounds: 0,
      roundHistory: [],
    }));
  };

  const newGame = () => {
    setState(defaultState);
  };

  const value = useMemo(
    () => ({
      state,
      startGame,
      addRound,
      updateRoundScores,
      deleteRound,
      resetGame,
      newGame,
    }),
    [state]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
