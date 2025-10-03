import { createContext } from "@lit/context";
import { Coordinate } from "ol/coordinate";
import { CountryCode, scoreFromDistance } from "./utils";
import { getDistance } from "ol/sphere";

export interface GameState {
    country: CountryCode | null;
    cameraPosition: Coordinate | null;
    guessedPosition: Coordinate | null;
    score: number | null;
    distance: number | null;
    scores: number[];
    roundPerGame: number;
}

export interface ActiveGameState extends GameState {
    country: CountryCode;
    cameraPosition: Coordinate;
}

export function startRound(gameState: GameState, cameraPosition: Coordinate): GameState {
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

export function endRound(gameState: GameState, guessedPosition: Coordinate): GameState {
    const distance = getDistance(gameState.cameraPosition!, guessedPosition);
    const score = scoreFromDistance(distance, gameState.country!);
    return {
        ...gameState,
        guessedPosition: guessedPosition,
        distance: distance,
        score: score,
        scores: [...gameState.scores, score],
    };
}

export function gameOver(gameState: GameState): boolean {
    return gameState.scores.length === gameState.roundPerGame;
}

// Between startRound and endRound
export function roundInProgress(gameState: GameState): boolean {
    return gameState.country !== null && gameState.cameraPosition !== null;
}

export const gameStateContext = createContext<GameState>('game-state');

