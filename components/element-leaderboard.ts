import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { LocalizeController } from "@shoelace-style/localize";

import "@awesome.me/webawesome/dist/components/card/card.js";

@customElement("element-leaderboard")
export default class ElementLeaderboard extends LitElement {
  private localize = new LocalizeController(this);

  render() {
    return html`
      <wa-card>
        <h3 slot="header">${this.localize.term("leaderboard")}</h3>
      </wa-card>
    `;
  }

  override createRenderRoot() {
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "element-leaderboard": ElementLeaderboard;
  }
}
