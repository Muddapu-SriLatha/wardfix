const { Server } = require('socket.io');

let io = null;

/**
 * Initialize Socket.io server instance
 * @param {import('http').Server} httpServer 
 */
function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
    },
    path: '/socket.io',
  });

  io.on('connection', (socket) => {
    console.log(`🔌 WebSocket Client Connected: ${socket.id}`);

    // Join municipal admin room if requested
    socket.on('join:admin', () => {
      socket.join('admin_room');
      console.log(`Socket ${socket.id} joined admin_room`);
    });

    // Join specific issue room for live thread/comment updates
    socket.on('join:issue', (issueId) => {
      const room = `issue_${issueId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} joined ${room}`);
    });

    socket.on('leave:issue', (issueId) => {
      socket.leave(`issue_${issueId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 WebSocket Client Disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Get active Socket.io instance
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
}

/**
 * Broadcast event when a new civic issue is created
 * @param {Object} issueData 
 */
function notifyIssueCreated(issueData) {
  if (!io) return;
  io.emit('issue:created', issueData);
  io.to('admin_room').emit('admin:alert', {
    type: 'NEW_REPORT',
    issueId: issueData.id,
    title: issueData.title,
    priority: issueData.priority,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Broadcast event when an issue status changes (submitted -> in_progress -> resolved)
 * @param {number|string} issueId 
 * @param {Object} statusData 
 */
function notifyStatusUpdated(issueId, statusData) {
  if (!io) return;
  io.emit('issue:status_updated', { issueId, ...statusData });
  io.to(`issue_${issueId}`).emit('issue:status_changed', statusData);
}

/**
 * Broadcast upvote tally update
 * @param {number|string} issueId 
 * @param {number} upvotesCount 
 */
function notifyUpvoteUpdated(issueId, upvotesCount) {
  if (!io) return;
  io.emit('issue:upvoted', { issueId, upvotesCount });
}

/**
 * Broadcast new comment on an issue
 * @param {number|string} issueId 
 * @param {Object} commentData 
 */
function notifyNewComment(issueId, commentData) {
  if (!io) return;
  io.to(`issue_${issueId}`).emit('comment:added', commentData);
}

module.exports = {
  initSocket,
  getIO,
  notifyIssueCreated,
  notifyStatusUpdated,
  notifyUpvoteUpdated,
  notifyNewComment,
};
