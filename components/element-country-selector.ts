import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import "@awesome.me/webawesome/dist/components/card/card.js";

@customElement("element-country-selector")
export default class ElementCountrySelector extends LitElement {
  private countryCode: string | null = null;

  render() {
    return html`
      <wa-dialog label="Choose a country" open>
        <div class="wa-grid" style="--min-column-size: 20px;">
          <wa-card
            class="wa-stack wa-align-items-center"
            @click=${() => this.selectCountry("ch")}
          >
            <div class="wa-stack wa-align-items-center">
              <div class="flag">🇨🇭</div>
              <div>switzerland</div>
            </div>
          </wa-card>
          <wa-card
            class="wa-stack wa-align-items-center"
            @click=${() => this.selectCountry("fr")}
          >
            <div class="wa-stack wa-align-items-center">
              <div class="flag">🇫🇷</div>
              <div>france</div>
            </div>
          </wa-card>
          <wa-card
            class="wa-stack wa-align-items-center"
            @click=${() => this.selectCountry("de")}
          >
            <div class="wa-stack wa-align-items-center">
              <div class="flag">🇩🇪</div>
              <div>germany</div>
            </div>
          </wa-card>
        </div>
      </wa-dialog>
    `;
  }

  protected firstUpdated(): void {
    this.querySelector("wa-dialog")?.addEventListener("wa-hide", (event) => {
      if (this.countryCode == null) {
        event.preventDefault();
      }
    });
  }

  selectCountry(countryCode: string) {
    this.countryCode = countryCode;
    this.querySelector("wa-dialog").open = false;
    this.dispatchEvent(
      new CustomEvent("country-selected", { detail: countryCode })
    );
  }

  override createRenderRoot() {
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "element-country-selector": ElementCountrySelector;
  }
}
