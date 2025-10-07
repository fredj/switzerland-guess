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
                <td>${this.rankStyle(index + 1)}</td>
                <td>${score.username}</td>
                <td>${score.score}</td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  rankStyle(rank: number) {
    if (rank === 1) {
      return html`<wa-icon name="trophy" variant="solid" style="color: #FFD700;"></wa-icon>`;
    } else if (rank === 2) {
      return html`<wa-icon name="trophy" variant="solid" style="color: #C0C0C0;"></wa-icon>`;
    } else if (rank === 3) {
      return html`<wa-icon name="trophy" variant="solid" style="color: #cd7f32;"></wa-icon>`;
    }
    return rank;
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
