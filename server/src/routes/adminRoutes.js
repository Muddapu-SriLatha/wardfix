const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getAnalytics,
  getSpatialClusters,
  updateIssueStatus,
  assignContractor,
  getContractorTasks,
  contractorResolveTask,
} = require('../controllers/adminController');

router.get('/analytics', getAnalytics);
router.get('/clusters', getSpatialClusters);
router.patch('/issues/:id/status', updateIssueStatus);
router.post('/issues/:id/assign', assignContractor);
router.get('/contractor/tasks', getContractorTasks);
router.patch('/contractor/tasks/:id/resolve', upload, contractorResolveTask);

module.exports = router;

