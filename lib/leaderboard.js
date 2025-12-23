import { ref, set, get, query, orderByChild, limitToFirst } from 'firebase/database';
import { database } from './firebase';

const NAMESPACE = 'sudoko-solver';

export async function addToLeaderboard(userId, username, time) {
  const leaderboardRef = ref(database, `${NAMESPACE}/leaderboard/${userId}`);
  await set(leaderboardRef, {
    username,
    time,
    timestamp: Date.now()
  });
}

export async function getTopScores(limit = 10) {
  const leaderboardRef = ref(database, `${NAMESPACE}/leaderboard`);
  const topQuery = query(leaderboardRef, orderByChild('time'), limitToFirst(limit));
  const snapshot = await get(topQuery);
  
  if (!snapshot.exists()) return [];
  
  const scores = [];
  snapshot.forEach((child) => {
    scores.push({
      userId: child.key,
      ...child.val()
    });
  });
  
  return scores;
}

export async function getUserRank(userId) {
  const leaderboardRef = ref(database, `${NAMESPACE}/leaderboard`);
  const snapshot = await get(leaderboardRef);
  
  if (!snapshot.exists()) return null;
  
  const allScores = [];
  snapshot.forEach((child) => {
    allScores.push({
      userId: child.key,
      time: child.val().time
    });
  });
  
  allScores.sort((a, b) => a.time - b.time);
  
  const rank = allScores.findIndex(score => score.userId === userId);
  return rank !== -1 ? rank + 1 : null;
}
