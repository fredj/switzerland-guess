import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  type Firestore,
} from "firebase/firestore/lite";


export interface ScoreEntry {
  username: string;
  score: number;
}

export type SavePolicy = (leaderboard: Leaderboard, userId: string) => Promise<boolean>;

export class Leaderboard {
  // FIXME: configurable via class options
  private static firebaseConfig = {
    authDomain: "switzerland-guess.firebaseapp.com",
    projectId: "switzerland-guess",
    storageBucket: "switzerland-guess.appspot.com",
  };
  private savePolicy: SavePolicy;
  public readonly collection: string;
  public readonly database: Firestore;

  constructor(document: string, savePolicy: SavePolicy) {
    this.savePolicy = savePolicy;

    this.collection = document;
    const app = initializeApp(Leaderboard.firebaseConfig);
    this.database = getFirestore(app);
  }

  async allowedToSubmitScore(userId: string): Promise<boolean> {
    return this.savePolicy(this, userId);
  }

  async saveScore(userId: string, username: string, score: number) {
    // FIXME: only save if score is better
    await setDoc(doc(this.database, this.collection, userId), {
      userId,
      username,
      score,
    });
  }

  async getLeaderboard(): Promise<Array<ScoreEntry>> {
    const scores: Array<ScoreEntry> = [];
    const querySnapshot = await getDocs(
      collection(this.database, this.collection)
    );
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // FIXME: see if we can access createTime
      scores.push({
        username: data.username,
        score: data.score,
      });
    });
    scores.sort((a, b) => b.score - a.score);
    return scores;
  }
}

// Always allow submitting a score
export async function always(leaderboard: Leaderboard, userId: string): Promise<boolean> {
  return true;
}

// Allow submitting a score only once per user and collection
export async function onlyOnce(leaderboard: Leaderboard, userId: string): Promise<boolean> {
  const q = query(
      collection(leaderboard.database, leaderboard.collection),
      where("userId", "==", userId)
    );
  const querySnapshot = await getDocs(q);
  return querySnapshot.size === 0;
}
