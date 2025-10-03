import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { GameState, gameStateContext } from "../game-state";
import { consume } from "@lit/context";

import "./element-leaderboard";

import "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import "@awesome.me/webawesome/dist/components/button/button.js";

@customElement("element-scores")
export class ElementScores extends LitElement {
  @consume({ context: gameStateContext, subscribe: true })
  gameState!: GameState;

  render() {
    const scores = this.gameState.scores;
    return html`
      <wa-dialog label="Scores">
        <div>
          <div>
            Your score:
            ${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}
          </div>
        </div>
        <div>Login to save your best score!</div>
        <!-- <element-leaderboard></element-leaderboard> -->
        <wa-button slot="footer" variant="brand" data-dialog="close"
          >New game</wa-button
        >
      </wa-dialog>
    `;
  }

  override createRenderRoot() {
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "element-scores": ElementScores;
  }
}
