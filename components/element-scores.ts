import { html, LitElement, PropertyValues } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { gameScore, GameState, gameStateContext } from "../game-state";
import { consume } from "@lit/context";

import "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import "@awesome.me/webawesome/dist/components/callout/callout.js";
import "@awesome.me/webawesome/dist/components/icon/icon.js";
import "@awesome.me/webawesome/dist/components/button/button.js";
import "@awesome.me/webawesome/dist/components/input/input.js";

import "./element-leaderboard";
import "./element-username";

import { Closable } from "../closable";
import { LocalizeController } from "@shoelace-style/localize";
import { always, Leaderboard, onlyOnce, ScoreEntry } from "../leaderboard";
import {getUserInfo, setUsername, UserInfo} from "../userinfo";

import { type ElementUsername } from "./element-username";
import type WaButton from "@awesome.me/webawesome/dist/components/button/button.js";

@customElement("element-scores")
export default class ElementScores extends Closable(LitElement) {
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

  @query("element-username") usernameElement!: ElementUsername;
  @query(".save_score") saveScoreButton!: WaButton;

  private leaderboard!: Leaderboard;

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
            ${this.localize.term("your_score")}: <strong>${gameScore(this.gameState)}</strong>
          </wa-callout>
          <!-- FIXME: check allowedToSubmitScore -->
          <wa-button class="save_score" variant="success" @click="${this.saveScore}">${this.localize.term("submit_score")}</wa-button>
          <element-username .leaderboard="${this.leaderboard}" @username="${this.handleUsernameSet}"></element-username>
          <element-leaderboard .scores="${this.scores}" .username="${this.userInfo.username}"></element-leaderboard>
        </div>
        <wa-button slot="footer" variant="brand" data-dialog="close">${this.localize.term("new_game")}</wa-button>
      </wa-dialog>
    `;
  }

  private async handleUsernameSet(event: CustomEvent) {
    const username = event.detail as string;
    this.userInfo = { ...this.userInfo, username };
    setUsername(username);
    await this.saveScoreToLeaderboard();
  }

  private async saveScore() {
    console.log(this.userInfo);
    if (this.userInfo.username === null) {
      this.usernameElement.open = true;
      // will continue in handleUsernameSet
    } else {
      await this.saveScoreToLeaderboard();
    }
  }

  private async saveScoreToLeaderboard() {
    if (this.allowedToSubmitScore) {
      await this.leaderboard.saveScore(this.userInfo.userId, this.userInfo.username, gameScore(this.gameState));
      this.allowedToSubmitScore = await this.leaderboard.allowedToSubmitScore(this.userInfo);
      // refresh scores after saving
      this.scores = await this.leaderboard.getLeaderboard();
    }
    this.saveScoreButton.disabled = true;
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
