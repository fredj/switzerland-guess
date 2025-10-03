import { customElement, state } from "lit/decorators.js";
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
  startRound,
} from "../game-state";
import { Coordinate } from "ol/coordinate";
import { CesiumWidget } from "@cesium/engine";
import Leaderboard from "../leaderboard";

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
    roundPerGame: 3,
  };
  private viewer: CesiumWidget | null = null;

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
      <element-country-selector
        @country-selected="${this.handleCountrySelected}"
      ></element-country-selector>
      <div id="cesium"></div>
      <div class="header">
        <cesium-compass-bar></cesium-compass-bar>
      </div>
      <element-guess @guess="${this.handleGuess}"></element-guess>
      <element-result @close="${this.handleCloseResult}"></element-result>
      <element-scores></element-scores>
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

    // The game is starting once this.gameState.country is set

    // const leaderboard = new Leaderboard("de");
    // const allowed = await leaderboard.allowedToSubmitScore("789");
    // if (allowed) {
    //   await leaderboard.saveScore("789", "789_username", 12);
    // } else {
    //   console.log("Not allowed to submit score");
    // }
    // const scores = await leaderboard.getLeaderboard();

    // debugger;

  }

  handleCountrySelected(event: CustomEvent) {
    this.gameState = {
      ...this.gameState,
      country: event.detail,
    };
  }

  handleGuess(event: CustomEvent<Coordinate>) {
    this.gameState = endRound(this.gameState, event.detail);
    // FIXME: hide element-guess
    this.querySelector("element-result").open = true;
  }

  handleCloseResult() {
    // FIXME: called just after firstUpdated
    if (roundInProgress(this.gameState)) {
      // Start a new round
      this.gameState = startRound(
        this.gameState,
        randomPositionInCountry(this.gameState.country)
      );
      setCameraPosition(this.viewer!, this.gameState.cameraPosition);
    }
  }

  override createRenderRoot() {
    return this;
  }
}
