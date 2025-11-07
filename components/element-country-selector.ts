import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import "@awesome.me/webawesome/dist/components/card/card.js";
import "@awesome.me/webawesome/dist/components/select/select.js";
import "@awesome.me/webawesome/dist/components/option/option.js";

import { LocalizeController } from "@shoelace-style/localize";
import { Closable } from "../closable";

@customElement("element-country-selector")
export default class ElementCountrySelector extends Closable(LitElement) {
  private readonly localize = new LocalizeController(this);

  render() {
    const lang = this.localize.lang();
    return html`
      <wa-dialog without-header>
        <h2>${this.localize.term("choose_country")}</h2>
        <div class="wa-stack">
          <div class="wa-grid" style="--min-column-size: 20px;">
            <wa-card
              class="wa-stack wa-align-items-center"
              @click=${() => this.selectCountry("ch")}
            >
              <div class="wa-stack wa-align-items-center">
                <div class="flag">🇨🇭</div>
                <div>${this.localize.term("switzerland")}</div>
              </div>
            </wa-card>
            <wa-card
              class="wa-stack wa-align-items-center"
              @click=${() => this.selectCountry("fr")}
            >
              <div class="wa-stack wa-align-items-center">
                <div class="flag">🇫🇷</div>
                <div>${this.localize.term("france")}</div>
              </div>
            </wa-card>
            <wa-card
              class="wa-stack wa-align-items-center"
              @click=${() => this.selectCountry("de")}
            >
              <div class="wa-stack wa-align-items-center">
                <div class="flag">🇩🇪</div>
                <div>${this.localize.term("germany")}</div>
              </div>
            </wa-card>
          </div>

          <wa-select @change="${this.selectLanguage}">
            <wa-option value="fr" ?selected=${lang === "fr"}>Français</wa-option>
            <wa-option value="de" ?selected=${lang === "de"}>Deutsch</wa-option>
            <wa-option value="en" ?selected=${lang === "en"}>English</wa-option>
          </wa-select>
        </div>
      </wa-dialog>
    `;
  }

  selectCountry(countryCode: string) {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("country-selected", { detail: countryCode })
    );
  }

  selectLanguage(event: Event) {
    const langCode = (event.target as HTMLSelectElement).value;
    document.documentElement.lang = langCode;
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
