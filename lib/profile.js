import { ref, set, get, update } from 'firebase/database';
import { database } from './firebase';

const NAMESPACE = 'sudoko-solver';

export async function createProfile(userId, username) {
  const profileRef = ref(database, `${NAMESPACE}/profiles/${userId}`);
  await set(profileRef, {
    username,
    createdAt: Date.now(),
    bestTime: null,
    gamesPlayed: 0
  });
}

export async function getProfile(userId) {
  const profileRef = ref(database, `${NAMESPACE}/profiles/${userId}`);
  const snapshot = await get(profileRef);
  return snapshot.exists() ? snapshot.val() : null;
}

export async function updateProfile(userId, data) {
  const profileRef = ref(database, `${NAMESPACE}/profiles/${userId}`);
  await update(profileRef, data);
}

export async function updateBestTime(userId, time) {
  const profile = await getProfile(userId);
  if (!profile.bestTime || time < profile.bestTime) {
    await updateProfile(userId, { bestTime: time });
    return true;
  }
  return false;
}

export async function incrementGamesPlayed(userId) {
  const profile = await getProfile(userId);
  await updateProfile(userId, { gamesPlayed: (profile.gamesPlayed || 0) + 1 });
}
