const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  createIssue,
  getIssues,
  getNearbyIssues,
  getIssueById,
  upvoteIssue,
  addComment,
} = require('../controllers/issueController');

router.get('/', getIssues);
router.get('/nearby', getNearbyIssues);
router.get('/:id', getIssueById);
router.post('/', authenticateToken, upload, createIssue);
router.post('/:id/upvote', authenticateToken, upvoteIssue);
router.post('/:id/comments', authenticateToken, addComment);

module.exports = router;
