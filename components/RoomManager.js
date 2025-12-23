'use client';

import { useState, useEffect } from 'react';
import { createRoom, joinRoom, subscribeToRoom, leaveRoom } from '../lib/rooms';
import { getCurrentUser } from '../lib/auth';

export default function RoomManager({ onRoomJoined }) {
  const [roomCode, setRoomCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async (difficulty) => {
    setLoading(true);
    setError('');
    
    try {
      const user = getCurrentUser();
      if (!user) {
        setError('Please log in first');
        return;
      }

      const code = await createRoom(user.uid, user.displayName, difficulty);
      setCurrentRoom({ code, difficulty });
      
      const unsubscribe = subscribeToRoom(code, (roomData) => {
        setCurrentRoom(roomData);
      });

      if (onRoomJoined) {
        onRoomJoined(code, difficulty);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const user = getCurrentUser();
      if (!user) {
        setError('Please log in first');
        return;
      }

      const roomData = await joinRoom(roomCode.toUpperCase(), user.uid, user.displayName);
      setCurrentRoom(roomData);
      
      const unsubscribe = subscribeToRoom(roomCode.toUpperCase(), (data) => {
        setCurrentRoom(data);
      });

      if (onRoomJoined) {
        onRoomJoined(roomCode.toUpperCase(), roomData.difficulty);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!currentRoom) return;

    try {
      const user = getCurrentUser();
      if (user) {
        await leaveRoom(currentRoom.code, user.uid);
      }
      setCurrentRoom(null);
      setRoomCode('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (currentRoom) {
    return (
      <div className="room-info">
        <h3>Room: {currentRoom.code}</h3>
        <p>Difficulty: {currentRoom.difficulty}</p>
        <div className="players-list">
          <h4>Players:</h4>
          {currentRoom.players && Object.entries(currentRoom.players).map(([id, player]) => (
            <div key={id} className="player-item">
              {player.username}
            </div>
          ))}
        </div>
        <button onClick={handleLeaveRoom} className="leave-button">
          Leave Room
        </button>
      </div>
    );
  }

  return (
    <div className="room-manager">
      <h3>Multiplayer Room</h3>
      
      <div className="room-create">
        <h4>Create Room</h4>
        <div className="create-buttons">
          <button onClick={() => handleCreateRoom('easy')} disabled={loading}>
            Easy
          </button>
          <button onClick={() => handleCreateRoom('medium')} disabled={loading}>
            Medium
          </button>
          <button onClick={() => handleCreateRoom('hard')} disabled={loading}>
            Hard
          </button>
        </div>
      </div>

      <div className="room-join">
        <h4>Join Room</h4>
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          placeholder="Enter room code"
          maxLength={8}
        />
        <button onClick={handleJoinRoom} disabled={loading || !roomCode.trim()}>
          Join
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
