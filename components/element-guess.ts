import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@awesome.me/webawesome/dist/components/card/card.js";
import "@awesome.me/webawesome/dist/components/button/button.js";

import "./element-map";
import { type Coordinate } from "ol/coordinate";

@customElement("element-guess")
export default class ElementGuess extends LitElement {
  @property({ type: Boolean, reflect: true }) open = true;

  @state()
  guessedPosition: Coordinate | null = null;

  render() {
    return html`
      <wa-card id="guess-card">
        <div slot="header">Where are you?</div>
        <element-map @map-click="${this.handleMapClick}"></element-map>
        <div slot="footer">
          <wa-button
            variant="brand"
            ?disabled="${this.guessedPosition == null}"
            @click="${this.validateGuess}"
            >Guess</wa-button
          >
        </div>
      </wa-card>
    `;
  }

  handleMapClick(event: CustomEvent) {
    this.guessedPosition = event.detail;
  }

  validateGuess() {
    this.dispatchEvent(
      new CustomEvent("guess", { detail: this.guessedPosition })
    );
    this.guessedPosition = null;
  }

  override createRenderRoot() {
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "element-guess": ElementGuess;
  }
}
