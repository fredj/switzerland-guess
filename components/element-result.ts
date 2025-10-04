import { html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
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

const kilometerFormat = Intl.NumberFormat("de-CH", {
  style: "unit",
  unit: "kilometer",
  maximumFractionDigits: 1,
});

@customElement("element-result")
export default class ElementResult extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;

  @consume({ context: gameStateContext, subscribe: true })
  gameState!: GameState;

  private dialogElement: Ref<WaDialog> = createRef();
  private mapElement: Ref<ElementMap> = createRef();

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has("open")) {
      this.dialogElement.value.open = this.open;

      if (!this.open) {
        this.dispatchEvent(new CustomEvent("close"));
      }
    }
  }

  render() {
    const isGameOver = gameOver(this.gameState);
    return html`
      <wa-dialog ${ref(this.dialogElement)}>
        <element-map ${ref(this.mapElement)}></element-map>
        <div class="wa-body-xl">${Math.round(
          this.gameState.score!
        )} points</div>
        <div>${kilometerFormat.format(this.gameState.distance! / 1000)} away</div>
        <div slot="footer">
          <wa-button slot="footer" variant="success" data-dialog="close" class="${isGameOver ? 'hidden' : ''}">
            Next round
            <wa-icon slot="end" name="arrow-right" variant="solid"></wa-icon>
          </wa-button>
          <wa-button slot="footer" variant="success" data-dialog="close" @click="${this.handleGameOver}" class="${isGameOver ? '' : 'hidden'}">
            Scores
            <wa-icon slot="end" name="trophy" variant="solid"></wa-icon>
          </wa-button>
        </div>
      </wa-dialog>
        `;
  }

  firstUpdated(): void {
    this.dialogElement.value.addEventListener(
      "wa-hide",
      () => (this.open = false)
    );
    this.dialogElement.value.addEventListener(
      "wa-show",
      () => (this.open = true)
    );
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
