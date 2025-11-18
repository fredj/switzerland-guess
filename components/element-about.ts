import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import "@awesome.me/webawesome/dist/components/button/button.js";
import "@awesome.me/webawesome/dist/components/icon/icon.js";

import { Closable } from "../closable";
import { LocalizeController } from "@shoelace-style/localize";

@customElement("element-about")
export default class ElementAbout extends Closable(LitElement) {
  private readonly localize = new LocalizeController(this);
  render() {
    return html`
      <wa-dialog label="${this.localize.term("about_us")}">
        <p>Hi! We’re Camptocamp, and we love maps.</p>
        <p>
          It all started over 20 years ago with an Open Source project for
          outdoor enthusiasts—camptocamp.org—and we’ve been mapping ever since.
          These days, we create smart, beautiful, and reliable maps for all
          kinds of clients: governments, non-profits, and companies of every
          shape and size.
        </p>
        <p>
          Our mission? To help people explore, understand, and navigate the
          world through intuitive, accurate, and innovative mapping tools.
        </p>
        <p>
          We also believe work should come with a good dose of fun, which is how
          XX Guess was born. At first, it was just an in-house challenge to see
          who knew their home country best. But then the competitive spirit
          kicked in, and we thought: why keep all this fun to ourselves?
        </p>
        <p>
          And while maps are our first love, they’re not our only one. We’re
          also a Gold Partner for the Open Source ERP software Odoo, and we keep
          IT infrastructures running smoothly so our clients can focus on what
          they do best. Our diverse set of skills are all united by our
          commitment to Open Source IT philosophy and our passion for creating
          digital experiences that are human and made to last.
        </p>
        <p>
          Curious about what we do or thinking about working together?
          <a href="https://camptocamp.com/${this.localize.lang()}/contact" target="_blank">
            Let us know. We’ll be in touch!</a>
        </p>

        <div slot="footer">
          <wa-button slot="footer" variant="brand" size="small" data-dialog="close" pill>
             <wa-icon slot="end" name="arrow-right"></wa-icon>
            ${this.localize.term("close")}
          </wa-button>
        </div>
      </wa-dialog>
    `;
  }

  override createRenderRoot() {
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "element-about": ElementAbout;
  }
}
