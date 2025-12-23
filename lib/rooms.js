import { ref, set, get, onValue, off, update } from 'firebase/database';
import { database } from './firebase';
import { nanoid } from 'nanoid';

const NAMESPACE = 'sudoko-solver';

export function generateRoomCode() {
  return nanoid(8).toUpperCase();
}

export async function createRoom(hostUserId, hostUsername, difficulty) {
  const roomCode = generateRoomCode();
  const roomRef = ref(database, `${NAMESPACE}/rooms/${roomCode}`);
  
  const roomData = {
    code: roomCode,
    host: hostUserId,
    hostUsername,
    difficulty,
    createdAt: Date.now(),
    players: {
      [hostUserId]: {
        username: hostUsername,
        joinedAt: Date.now(),
      }
    },
    gameState: null,
  };
  
  await set(roomRef, roomData);
  return roomCode;
}

export async function joinRoom(roomCode, userId, username) {
  const roomRef = ref(database, `${NAMESPACE}/rooms/${roomCode}`);
  const snapshot = await get(roomRef);
  
  if (!snapshot.exists()) {
    throw new Error('Room not found');
  }
  
  const playerRef = ref(database, `${NAMESPACE}/rooms/${roomCode}/players/${userId}`);
  await set(playerRef, {
    username,
    joinedAt: Date.now(),
  });
  
  return snapshot.val();
}

export async function leaveRoom(roomCode, userId) {
  const playerRef = ref(database, `${NAMESPACE}/rooms/${roomCode}/players/${userId}`);
  await set(playerRef, null);
}

export async function updateRoomGameState(roomCode, gameState) {
  const gameStateRef = ref(database, `${NAMESPACE}/rooms/${roomCode}/gameState`);
  await set(gameStateRef, gameState);
}

export async function updatePlayerMove(roomCode, userId, move) {
  const moveRef = ref(database, `${NAMESPACE}/rooms/${roomCode}/moves/${Date.now()}`);
  await set(moveRef, {
    userId,
    move,
    timestamp: Date.now(),
  });
}

export function subscribeToRoom(roomCode, callback) {
  const roomRef = ref(database, `${NAMESPACE}/rooms/${roomCode}`);
  onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
  
  return () => off(roomRef);
}

export function subscribeToGameState(roomCode, callback) {
  const gameStateRef = ref(database, `${NAMESPACE}/rooms/${roomCode}/gameState`);
  onValue(gameStateRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
  
  return () => off(gameStateRef);
}

export function subscribeToMoves(roomCode, callback) {
  const movesRef = ref(database, `${NAMESPACE}/rooms/${roomCode}/moves`);
  onValue(movesRef, (snapshot) => {
    if (snapshot.exists()) {
      const moves = [];
      snapshot.forEach((child) => {
        moves.push({ id: child.key, ...child.val() });
      });
      callback(moves);
    }
  });
  
  return () => off(movesRef);
}

export async function deleteRoom(roomCode) {
  const roomRef = ref(database, `${NAMESPACE}/rooms/${roomCode}`);
  await set(roomRef, null);
}
