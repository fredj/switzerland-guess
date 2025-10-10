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
import { always, Leaderboard, onlyOnce, ScoreEntry } from "../leaderboard";
import {getUserInfo, setUsername, UserInfo} from "../userinfo";

@customElement("element-scores")
export class ElementScores extends Closable(LitElement) {
  private readonly localize = new LocalizeController(this);
  @consume({ context: gameStateContext, subscribe: true })
  @state()
  gameState!: GameState;

  @state()
  userInfo: UserInfo = getUserInfo();

  @state()
  scores: ScoreEntry[] = [];

  @state()
  allowedToSubmitScore: boolean = false;

  private leaderboard: Leaderboard | null = null;

  async willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has("gameState")) {
      if (this.gameState.country && this.leaderboard?.collection !== this.gameState.country) {
        this.leaderboard = new Leaderboard(this.gameState.country, always);
        this.scores = await this.leaderboard.getLeaderboard();

        if (this.userInfo) {
          this.allowedToSubmitScore = await this.leaderboard.allowedToSubmitScore(this.userInfo.userId);
        }
      }
    }
  }

  render() {
    return html`
      <wa-dialog label="${this.localize.term("game_over")}">
        <div class="wa-stack wa-gap-2xl">
          <wa-callout variant="success">
            <wa-icon slot="icon" name="thumbs-up" variant="solid"></wa-icon>
            <!-- FIXME: show username if set -->
            ${this.localize.term("your_score")}: <strong>${gameScore(this.gameState)}</strong>
          </wa-callout>

          <element-leaderboard .scores="${this.scores}" .username="${this.userInfo.username}"></element-leaderboard>

          <form @submit="${this.saveScore}" ?hidden=${!this.allowedToSubmitScore}>
            <div class="wa-flank:end wa-gap-0">
              <wa-input name="username" .value=${this.userInfo.username} placeholder=${this.localize.term("username")} required ?disabled=${this.userInfo.username !== null}></wa-input>
              <!-- FIXME: deactivate once score submitted -->
              <wa-button type="submit" variant="brand">${this.localize.term("submit_score")}</wa-button>
            </div>
          </form>

        </div>
        <wa-button slot="footer" variant="success" data-dialog="close">${this.localize.term("new_game")}</wa-button>
      </wa-dialog>
    `;
  }

  async saveScore(event: SubmitEvent) {
    event.preventDefault();
    if (this.userInfo.username === null) {
      // FIXME: we accept username only if
      // - not empty


      const formData = new FormData(event.target as HTMLFormElement);
      const username = formData.get("username") as string;
      this.userInfo = { ...this.userInfo, username };
      setUsername(username);
    }

    if (this.allowedToSubmitScore) {
      await this.leaderboard.saveScore(this.userInfo.userId, this.userInfo.username, gameScore(this.gameState));
      this.allowedToSubmitScore = await this.leaderboard.allowedToSubmitScore(this.userInfo);
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
