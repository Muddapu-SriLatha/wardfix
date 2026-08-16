import { io } from 'socket.io-client';

let socket = null;

export function initSocketClient() {
  if (!socket) {
    socket = io({
      path: '/socket.io',
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to CivicFix WebSocket Gateway:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('⚡ Disconnected from WebSocket Gateway');
    });
  }
  return socket;
}

export function getSocket() {
  if (!socket) {
    return initSocketClient();
  }
  return socket;
}

export function joinAdminRoom() {
  const s = getSocket();
  s.emit('join:admin');
}

export function joinIssueRoom(issueId) {
  const s = getSocket();
  s.emit('join:issue', issueId);
}

export function leaveIssueRoom(issueId) {
  const s = getSocket();
  s.emit('leave:issue', issueId);
}
