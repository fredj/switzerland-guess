import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import "@awesome.me/webawesome/dist/components/card/card.js";

@customElement("element-leaderboard")
export default class ElementLeaderboard extends LitElement {
  render() {
    return html`
      <wa-card>
        <h3 slot="header">leaderboard</h3>
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
