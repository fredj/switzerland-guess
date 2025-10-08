import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { ref, createRef } from "lit/directives/ref.js";

import "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import "@awesome.me/webawesome/dist/components/button/button.js";
import "@awesome.me/webawesome/dist/components/icon/icon.js";

import "./element-map";

import type { Ref } from "lit/directives/ref.js";
import type WaDialog from "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import { consume } from "@lit/context";
import ElementMap from "./element-map";
import { gameOver, GameState, gameStateContext } from "../game-state";
import { Closable } from "../closable";
import { LocalizeController } from "@shoelace-style/localize";

const kilometerFormat = Intl.NumberFormat("de-CH", {
  style: "unit",
  unit: "kilometer",
  maximumFractionDigits: 1,
});

@customElement("element-result")
export default class ElementResult extends Closable(LitElement) {
  private readonly localize = new LocalizeController(this);
  @consume({ context: gameStateContext, subscribe: true })
  gameState!: GameState;

  private dialogElement: Ref<WaDialog> = createRef();
  private mapElement: Ref<ElementMap> = createRef();

  render() {
    const isGameOver = gameOver(this.gameState);
    return html`
      <wa-dialog ${ref(this.dialogElement)} label="${this.localize.term("round")} ${this.gameState.scores.length}/${this.gameState.roundPerGame}" open>
        <element-map ${ref(this.mapElement)}></element-map>
        <div class="wa-body-xl">${Math.round(this.gameState.score!)} ${this.localize.term("points")}</div>
        <div>${kilometerFormat.format(this.gameState.distance! / 1000)}</div>
        <div slot="footer">
          <wa-button slot="footer" variant="success" data-dialog="close" class="${isGameOver ? 'hidden' : ''}">
            ${this.localize.term("next_round")}
            <wa-icon slot="end" name="arrow-right" variant="solid"></wa-icon>
          </wa-button>
          <wa-button slot="footer" variant="success" data-dialog="close" @click="${this.handleGameOver}" class="${isGameOver ? '' : 'hidden'}">
            ${this.localize.term("scores")}
            <wa-icon slot="end" name="trophy" variant="solid"></wa-icon>
          </wa-button>
        </div>
      </wa-dialog>
        `;
  }

  handleGameOver() {
    this.dispatchEvent(new CustomEvent("gameOver"));
  }

  override createRenderRoot() {
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "element-result": ElementResult;
  }
}
