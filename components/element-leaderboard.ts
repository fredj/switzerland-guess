import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ScoreEntry } from "../leaderboard";

@customElement("element-leaderboard")
export default class ElementLeaderboard extends LitElement {
  @property({ type: Array }) scores: ScoreEntry[] = [];

  render() {
    return html`
      <table>
        <tbody>
          ${this.scores.map(
            (score, index) => html`
              <tr>
                <td>${index + 1}</td>
                <td>${score.username}</td>
                <td>${score.score}</td>
              </tr>
            `
          )}
        </tbody>
      </table>
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
