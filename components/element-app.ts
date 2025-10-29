import { customElement, query, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { randomPositionInCountry } from "../utils";
import { html, LitElement } from "lit";

import CesiumSphereCamera from "@geoblocks/cesium-sphere-camera";

import "@geoblocks/cesium-compass-bar";
import "./element-guess";
import "./element-result";
import "./element-country-selector";
import "./element-scores";

import { createCesiumWidget, setCameraPosition } from "../cesium";
import {
  endRound,
  GameState,
  gameStateContext,
  roundInProgress,
  startGame,
  startRound,
} from "../game-state";
import { Coordinate } from "ol/coordinate";

import { type CesiumWidget } from "@cesium/engine";
import type ElementResult from "./element-result";
import type ElementScores from "./element-scores";

@customElement("element-app")
export class ElementApp extends LitElement {
  @provide({ context: gameStateContext })
  @state()
  gameState: GameState = {
    country: null,
    cameraPosition: null,
    guessedPosition: null,
    score: null,
    distance: null,
    scores: [],
    roundPerGame: 1,
  };
  private viewer: CesiumWidget | null = null;

  @query('element-result') resultElement!: ElementResult;
  @query('element-scores') scoresElement!: ElementScores;

  updated() {
    if (this.gameState.country !== null && !roundInProgress(this.gameState)) {
      // First game round after country selection
      this.gameState = startRound(
        this.gameState,
        randomPositionInCountry(this.gameState.country)
      );
      setCameraPosition(this.viewer!, this.gameState.cameraPosition);
    }
  }

  render() {
    return html`
      <element-country-selector .open="${this.gameState.country == null}"
        @country-selected="${this.handleCountrySelected}"
      ></element-country-selector>
      <div id="cesium"></div>
      <div class="header">
        <cesium-compass-bar></cesium-compass-bar>
      </div>
      <element-guess ?hidden="${!roundInProgress(this.gameState)}" @guess="${this.handleGuess}"></element-guess>
      <element-result @close="${this.handleCloseResult}" @gameOver="${this.handleGameOver}"></element-result>
      <element-scores @close="${this.handleCloseScores}"></element-scores>
    `;
  }

  async firstUpdated() {
    this.viewer = await createCesiumWidget(
      this.querySelector<HTMLDivElement>("#cesium")!
    );

    const sphereMode = new CesiumSphereCamera(this.viewer);
    sphereMode.active = true;
    const compassBar = this.querySelector("cesium-compass-bar");
    compassBar.scene = this.viewer.scene;
  }

  handleCountrySelected(event: CustomEvent) {
    this.gameState = {
      ...this.gameState,
      country: event.detail,
    };
  }

  handleGuess(event: CustomEvent<Coordinate>) {
    this.resultElement.open = true;
    // FIXME: hide element-guess ?
    this.gameState = endRound(this.gameState, event.detail);
  }

  handleGameOver() {
    this.scoresElement.open = true;
  }

  handleCloseResult() {
    if (roundInProgress(this.gameState)) {
      // Start a new round
      this.gameState = startRound(
        this.gameState,
        randomPositionInCountry(this.gameState.country)
      );
      setCameraPosition(this.viewer!, this.gameState.cameraPosition);
    }
  }

  handleCloseScores() {
    // FIXME: choose country again ?
    this.gameState = startGame(this.gameState);
  }

  override createRenderRoot() {
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "element-app": ElementApp;
  }
}
