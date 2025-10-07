import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import "@awesome.me/webawesome/dist/components/card/card.js";
import "@awesome.me/webawesome/dist/components/button/button.js";

import "./element-map";
import { type Coordinate } from "ol/coordinate";
import { LocalizeController } from "@shoelace-style/localize";

@customElement("element-guess")
export default class ElementGuess extends LitElement {
  private localize = new LocalizeController(this);

  @state()
  guessedPosition: Coordinate | null = null;

  render() {
    return html`
      <wa-card id="guess-card">
        <div slot="header">${this.localize.term("where_are_you")}</div>
        <element-map @map-click="${this.handleMapClick}"></element-map>
        <div slot="footer">
          <wa-button
            variant="brand"
            ?disabled="${this.guessedPosition == null}"
            @click="${this.validateGuess}"
            >${this.localize.term("guess")}</wa-button
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
