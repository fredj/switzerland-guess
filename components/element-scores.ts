import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { GameState, gameStateContext } from "../game-state";
import { consume } from "@lit/context";

import "./element-leaderboard";

import "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import "@awesome.me/webawesome/dist/components/button/button.js";
import { Closable } from "../closable";
import { LocalizeController } from "@shoelace-style/localize";

@customElement("element-scores")
export class ElementScores extends Closable(LitElement) {
  private localize = new LocalizeController(this);
  @consume({ context: gameStateContext, subscribe: true })
  gameState!: GameState;

  render() {
    const scores = this.gameState.scores;
    return html`
      <wa-dialog label="${this.localize.term("scores")}">
        <div>
          <div>
            ${this.localize.term("your_score")}:
            ${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}
          </div>
        </div>
        <element-leaderboard></element-leaderboard>
        <wa-button slot="footer" variant="brand" data-dialog="close">${this.localize.term("new_game")}</wa-button>
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
