import { createContext } from "@lit/context";
import type { Coordinate } from "ol/coordinate";
import { getDistance } from "ol/sphere";
import type { CountryCode } from "./utils";
import { scoreFromDistance } from "./utils";

export interface GameState {
  country: CountryCode | null;
  cameraPosition: Coordinate | null;
  guessedPosition: Coordinate | null;
  score: number | null;
  distance: number | null;
  scores: number[];
  roundPerGame: number;
}

export function startGame(gameState: GameState): GameState {
  return {
    ...gameState,
    cameraPosition: null,
    guessedPosition: null,
    score: null,
    distance: null,
    scores: [],
  };
}

export function startRound(
  gameState: GameState,
  cameraPosition: Coordinate,
): GameState {
  if (gameState.country == null) {
    throw new Error("Cannot start round without a selected country");
  }
  return {
    ...gameState,
    cameraPosition: cameraPosition,
    guessedPosition: null,
    score: null,
    distance: null,
  };
}

export function endRound(
  gameState: GameState,
  guessedPosition: Coordinate,
): GameState {
  const distance = getDistance(gameState.cameraPosition, guessedPosition);
  // Use existing bonus score if any
  let score = gameState.score || 0;
  score += scoreFromDistance(distance, gameState.country);
  return {
    ...gameState,
    guessedPosition: guessedPosition,
    distance: distance,
    score: score,
    scores: [...gameState.scores, score],
  };
}

export function gameScore(gameState: GameState): number {
  return Math.round(
    gameState.scores.reduce((a, b) => a + b, 0) / gameState.scores.length,
  );
}

export function gameOver(gameState: GameState): boolean {
  return gameState.scores.length === gameState.roundPerGame;
}

// Between startRound and endRound
export function roundInProgress(gameState: GameState): boolean {
  return gameState.country !== null && gameState.cameraPosition !== null;
}

export const gameStateContext = createContext<GameState>("game-state");
