const { knex, isPostgresAvailable } = require('../config/db');
const { notifyStatusUpdated } = require('../websocket/socketHandler');

async function getAnalytics(req, res) {
  try {
    const totalIssues = await knex('issues').count('id as count').first();
    const statusCounts = await knex('issues')
      .select('status')
      .count('id as count')
      .groupBy('status');

    const priorityCounts = await knex('issues')
      .select('priority')
      .count('id as count')
      .groupBy('priority');

    const categoryBreakdown = await knex('issues')
      .leftJoin('categories', 'issues.category_id', 'categories.id')
      .select('categories.name as category', 'categories.icon')
      .count('issues.id as count')
      .groupBy('categories.name', 'categories.icon');

    const totalCount = parseInt(totalIssues.count || totalIssues['count']) || 1;
    const resolvedItem = statusCounts.find(s => s.status === 'resolved');
    const resolvedCount = resolvedItem ? parseInt(resolvedItem.count || resolvedItem['count']) : 0;
    const resolutionRate = ((resolvedCount / totalCount) * 100).toFixed(1);

    res.json({
      total_issues: totalCount,
      resolution_rate: parseFloat(resolutionRate),
      by_status: statusCounts,
      by_priority: priorityCounts,
      by_category: categoryBreakdown,
    });
  } catch (error) {
    console.error('Error computing municipal analytics:', error);
    res.status(500).json({ error: 'Server error generating analytics' });
  }
}

async function getSpatialClusters(req, res) {
  try {
    const { eps_distance = 0.005, min_points = 2 } = req.query;

    if (isPostgresAvailable) {
      const clusters = await knex.raw(`
        WITH clustered AS (
          SELECT 
            id, title, category_id, status, priority, latitude, longitude,
            ST_ClusterDBSCAN(location, eps := ?, minpoints := ?) OVER() as cid
          FROM issues
          WHERE location IS NOT NULL
        )
        SELECT 
          cid as cluster_id,
          COUNT(*) as issue_count,
          AVG(latitude) as center_lat,
          AVG(longitude) as center_lng,
          JSON_AGG(JSON_BUILD_OBJECT('id', id, 'title', title, 'status', status, 'priority', priority)) as issues
        FROM clustered
        WHERE cid IS NOT NULL
        GROUP BY cid
        ORDER BY issue_count DESC;
      `, [parseFloat(eps_distance), parseInt(min_points)]);

      return res.json({ clusters: clusters.rows });
    }

    // In-memory grid clustering fallback for SQLite / local environment
    const allIssues = await knex('issues').select('id', 'title', 'category_id', 'status', 'priority', 'latitude', 'longitude', 'neighborhood');
    
    // Group by neighborhood / rounded coordinates
    const clustersMap = {};
    allIssues.forEach((issue) => {
      const key = issue.neighborhood || `${issue.latitude.toFixed(2)},${issue.longitude.toFixed(2)}`;
      if (!clustersMap[key]) {
        clustersMap[key] = { cluster_id: key, issue_count: 0, center_lat: issue.latitude, center_lng: issue.longitude, issues: [] };
      }
      clustersMap[key].issue_count++;
      clustersMap[key].issues.push(issue);
    });

    res.json({
      clusters: Object.values(clustersMap),
    });
  } catch (error) {
    console.error('Error generating spatial clusters:', error);
    res.status(500).json({ error: 'Spatial clustering failed' });
  }
}

async function updateIssueStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, priority, assigned_department, resolution_notes } = req.body;

    const issue = await knex('issues').where({ id }).first();
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (assigned_department) updates.assigned_department = assigned_department;
    if (resolution_notes) updates.resolution_notes = resolution_notes;

    if (status === 'resolved' && issue.status !== 'resolved') {
      updates.resolved_at = new Date().toISOString();
    }

    updates.updated_at = new Date().toISOString();

    await knex('issues').where({ id }).update(updates);
    const updatedIssue = await knex('issues').where({ id }).first();

    try {
      await knex('comments').insert({
        issue_id: id,
        user_id: req.user ? req.user.id : 2,
        content: resolution_notes || `Status changed from '${issue.status}' to '${status || issue.status}'`,
        is_internal: true,
        status_change: status || issue.status,
      });
    } catch (commentErr) {
      console.warn('Comment logging notice:', commentErr.message);
    }

    notifyStatusUpdated(id, {
      oldStatus: issue.status,
      newStatus: updatedIssue.status,
      priority: updatedIssue.priority,
      resolution_notes: updatedIssue.resolution_notes,
      resolved_at: updatedIssue.resolved_at,
    });

    res.json({ message: 'Issue status updated successfully', issue: updatedIssue });
  } catch (error) {
    console.error('Error updating issue status:', error);
    res.status(500).json({ error: 'Server error updating issue status' });
  }
}

async function assignContractor(req, res) {
  try {
    const { id } = req.params;
    const { contractor_name, assigned_department, notes } = req.body;

    const issue = await knex('issues').where({ id }).first();
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const assignedContractorName = contractor_name || 'Suresh Reddy (PWD Contractor)';

    const updates = {
      status: 'in_progress',
      assigned_department: assigned_department || issue.assigned_department || 'BBMP PWD',
      assigned_contractor: assignedContractorName,
      updated_at: new Date().toISOString(),
    };

    try {
      await knex('issues').where({ id }).update(updates);
    } catch (dbErr) {
      delete updates.assigned_contractor;
      await knex('issues').where({ id }).update(updates);
    }

    const commentContent = `🚜 Contractor Assigned: ${assignedContractorName} dispatched to location. Notes: ${notes || 'Work order initiated.'}`;
    await knex('comments').insert({
      issue_id: id,
      user_id: req.user ? req.user.id : 2,
      content: commentContent,
      is_internal: false,
      status_change: 'in_progress',
    });

    notifyStatusUpdated(id, {
      oldStatus: issue.status,
      newStatus: 'in_progress',
      assigned_department: updates.assigned_department,
      assigned_contractor: assignedContractorName,
    });

    res.json({ message: 'Contractor assigned successfully', issue: { ...issue, ...updates } });
  } catch (error) {
    console.error('Error assigning contractor:', error);
    res.status(500).json({ error: 'Failed to assign contractor' });
  }
}

async function getContractorTasks(req, res) {
  try {
    const tasks = await knex('issues')
      .leftJoin('categories', 'issues.category_id', 'categories.id')
      .select('issues.*', 'categories.name as category_name')
      .orderBy('issues.id', 'desc');

    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching contractor tasks:', error);
    res.status(500).json({ error: 'Failed to fetch contractor tasks' });
  }
}

async function contractorResolveTask(req, res) {
  try {
    const { id } = req.params;
    const { resolution_notes } = req.body;
    const proofFile = req.file;

    const issue = await knex('issues').where({ id }).first();
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const proofUrl = proofFile ? `/uploads/${proofFile.filename}` : issue.image_url;
    const notes = resolution_notes || 'Repair completed. Site verified by PWD Field Contractor.';

    const updates = {
      status: 'resolved',
      resolution_notes: notes,
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await knex('issues').where({ id }).update(updates);

    await knex('comments').insert({
      issue_id: id,
      user_id: req.user ? req.user.id : 3,
      content: `✅ Task Completed by Field Contractor. Proof of Work Verified: ${notes}`,
      is_internal: false,
      status_change: 'resolved',
    });

    notifyStatusUpdated(id, {
      oldStatus: issue.status,
      newStatus: 'resolved',
      resolution_notes: notes,
      resolved_at: updates.resolved_at,
    });

    res.json({ message: 'Task marked as resolved with proof of work!', issue: { ...issue, ...updates } });
  } catch (error) {
    console.error('Error resolving contractor task:', error);
    res.status(500).json({ error: 'Failed to resolve task' });
  }
}

module.exports = {
  getAnalytics,
  getSpatialClusters,
  updateIssueStatus,
  assignContractor,
  getContractorTasks,
  contractorResolveTask,
};

