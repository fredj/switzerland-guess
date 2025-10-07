import { html, LitElement, PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";
import { gameScore, GameState, gameStateContext } from "../game-state";
import { consume } from "@lit/context";

import "./element-leaderboard";

import "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import "@awesome.me/webawesome/dist/components/callout/callout.js";
import "@awesome.me/webawesome/dist/components/icon/icon.js";
import "@awesome.me/webawesome/dist/components/button/button.js";
import "@awesome.me/webawesome/dist/components/input/input.js";

import { Closable } from "../closable";
import { LocalizeController } from "@shoelace-style/localize";
import { Leaderboard, getUserInfo, ScoreEntry, UserInfo, setUsername } from "../leaderboard";

@customElement("element-scores")
export class ElementScores extends Closable(LitElement) {
  private localize = new LocalizeController(this);
  @consume({ context: gameStateContext, subscribe: true })
  @state()
  gameState!: GameState;

  @state()
  userInfo: UserInfo = getUserInfo();

  @state()
  scores: ScoreEntry[] = [];

  @state()
  allowedToSubmitScore: boolean = true;

  private leaderboard: Leaderboard | null = null;

  async willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has("gameState")) {
      if (this.gameState.country && this.leaderboard?.collection !== this.gameState.country) {
        this.leaderboard = new Leaderboard(this.gameState.country);
        this.scores = await this.leaderboard.getLeaderboard();
      }
    }
    if (changedProperties.has("userInfo")) {
      if (this.leaderboard) {
        this.allowedToSubmitScore = await this.leaderboard.allowedToSubmitScore(this.userInfo.userId);
      }
    }
  }

  render() {
    return html`
      <wa-dialog label="${this.localize.term("game_over")}">
        <div>
          <wa-callout variant="success">
            <wa-icon slot="icon" name="thumbs-up" variant="solid"></wa-icon>
            ${this.localize.term("your_score")}: <strong>${gameScore(this.gameState)}</strong>
          </wa-callout>
          <br />

          <element-leaderboard .scores="${this.scores}"></element-leaderboard>

          <!-- FIXME: only show the form if allowed to submit score -->
          <form @submit="${this.saveScore}">
            <wa-input name="username" .value=${this.userInfo.username} label=${this.localize.term("username")} required ?disabled=${this.userInfo.username !== null}></wa-input>
            <br />
            <wa-button type="submit" variant="brand">${this.localize.term("submit_score")}</wa-button>
          </form>

        </div>
        <wa-button slot="footer" variant="success" data-dialog="close">${this.localize.term("new_game")}</wa-button>
      </wa-dialog>
    `;
  }

  async saveScore(event: SubmitEvent) {
    event.preventDefault();
    if (this.userInfo.username === null) {
      const formData = new FormData(event.target as HTMLFormElement);
      const username = formData.get("username") as string;
      this.userInfo = { ...this.userInfo, username };
      setUsername(this.userInfo.username);
    }

    if (this.allowedToSubmitScore) {
      await this.leaderboard.saveScore(this.userInfo.userId, this.userInfo.username, gameScore(this.gameState));
      // refresh scores after saving
      this.scores = await this.leaderboard.getLeaderboard();
    }
  }

  override createRenderRoot() {
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "element-scores": ElementScores;
  }
}
