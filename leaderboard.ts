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
  date: string;
}

export default class Leaderboard {
  private static firebaseConfig = {
    authDomain: "switzerland-guess.firebaseapp.com",
    projectId: "switzerland-guess",
    storageBucket: "switzerland-guess.appspot.com",
  };
  private collection: string;
  private database: Firestore;

  constructor(document: string) {
    this.collection = document;
    const app = initializeApp(Leaderboard.firebaseConfig);
    this.database = getFirestore(app);
  }

  async allowedToSubmitScore(userId: string): Promise<boolean> {
    // only one score per userId and document
    const q = query(
      collection(this.database, this.collection),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size === 0;
  }

  async saveScore(userId: string, username: string, score: number) {
    await setDoc(doc(this.database, this.collection, userId), {
      userId,
      username,
      score,
      date: new Date().toISOString(),
    });
  }

  async getLeaderboard(): Promise<Array<ScoreEntry>> {
    const scores: Array<ScoreEntry> = [];
    const querySnapshot = await getDocs(
      collection(this.database, this.collection)
    );
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      scores.push({
        username: data.username,
        score: data.score,
        date: data.date,
      });
    });
    scores.sort((a, b) => b.score - a.score);
    return scores;
  }
}
