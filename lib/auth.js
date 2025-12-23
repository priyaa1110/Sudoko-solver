import { signInAnonymously, updateProfile } from 'firebase/auth';
import { auth } from './firebase';

export async function loginAnonymously(username) {
  const userCredential = await signInAnonymously(auth);
  await updateProfile(userCredential.user, { displayName: username });
  return userCredential.user;
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function onAuthChange(callback) {
  return auth.onAuthStateChanged(callback);
}

export async function logout() {
  await auth.signOut();
}
