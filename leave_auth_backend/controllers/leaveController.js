const pool = require('../db');
const { differenceInBusinessDays } = require('date-fns');

const submitLeaveApplication = async (req, res) => {
  const {
    applicantId,
    applicantName,
    applicantDepartment,
    leaveType,
    startDate,
    endDate,
    reason,
    isUrgent,
    alternateArrangements,
    contactDuringLeave,
    approvalChain,
    currentApprover
  } = req.body;

  // Extract file names from uploaded files (handled by multer)
  //const documents = req.files?.map(file => file.filename) || [];
  const documents = JSON.parse(req.body.documents);

  try {
    const result = await pool.query(
      `INSERT INTO leave_applications 
        (applicant_id, leave_type, start_date, end_date, reason, is_urgent, 
          alternate_arrangements, contact_during_leave, documents, approval_chain, current_approver) 
        VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        applicantId,
        leaveType,
        startDate,
        endDate,
        reason,
        isUrgent,
        alternateArrangements,
        contactDuringLeave,
        documents,
        JSON.stringify(approvalChain),
        currentApprover
      ]
    );

    // Notify first approver
    let approverId = null;

    if (currentApprover === 'director') {
      // Director doesn't have department
      const director = await pool.query(`SELECT id FROM users WHERE role = 'director' LIMIT 1`);
      approverId = director.rows[0]?.id;
    } else if (currentApprover === 'registrar') {
      const registrar = await pool.query(`SELECT id FROM users WHERE role = 'registrar' LIMIT 1`);
      approverId = registrar.rows[0]?.id;
    } else {
      const approver = await pool.query(
        `SELECT id FROM users WHERE role = $1 AND department = $2 LIMIT 1`,
        [currentApprover, applicantDepartment]
      );
      approverId = approver.rows[0]?.id;
    }

    // 3. Insert notification for approver
    if (approverId) {
      await pool.query(
        `INSERT INTO notifications (user_id, message, is_read, created_at, type)
        VALUES ($1, $2, false, NOW(), $3)`,
        [
          approverId,
          `${applicantName} submitted a ${leaveType} leave request`,
          'approval'
        ]
      );
    } else {
      console.warn('No approver found for role:', currentApprover, 'in department:', applicantDepartment);
    }

    res.status(201).json({ message: 'Leave application submitted', application: result.rows[0] });
  } catch (err) {
    console.error('Leave application error:', err);
    res.status(500).json({ message: 'Failed to submit leave application' });
  }
};


const getUserLeaves = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        la.id,
        la.leave_type,
        la.start_date,
        la.end_date,
        la.reason,
        la.is_urgent,
        la.status,
        la.created_at,
        la.updated_at,
        la.documents,
        la.approval_chain,
        la.current_approver,
        la.alternate_arrangements,
        la.contact_during_leave,
        u.id as applicant_id,
        u.name as applicant_name,
        u.department as applicant_department
      FROM leave_applications la
      JOIN users u ON la.applicant_id = u.id
      WHERE la.applicant_id = $1
      ORDER BY la.created_at DESC
    `, [userId]);

    const leaves = result.rows.map((leave) => ({
      id: leave.id.toString(),
      applicantId: leave.applicant_id.toString(),
      applicantName: leave.applicant_name,
      applicantDepartment: leave.applicant_department,
      leaveType: leave.leave_type,
      startDate: leave.start_date,
      endDate: leave.end_date,
      reason: leave.reason,
      isUrgent: leave.is_urgent,
      status: leave.status,
      createdAt: leave.created_at,
      updatedAt: leave.updated_at,
      documents: leave.documents || [],
      approvalChain: JSON.parse(leave.approval_chain || '[]'),
      currentApprover: leave.current_approver,
      alternateArrangements: leave.alternate_arrangements,
      contactDuringLeave: leave.contact_during_leave,
    }));

    res.json(leaves);
  } catch (err) {
    console.error('Error in getUserLeaves:', err);
    res.status(500).json({ message: 'Failed to fetch leaves' });
  }
};

const getPendingApprovals = async (req, res) => {
  const { role } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        la.id,
        la.leave_type,
        la.start_date,
        la.end_date,
        la.reason,
        la.is_urgent,
        la.status,
        la.created_at,
        la.updated_at,
        la.documents,
        la.approval_chain,
        la.current_approver,
        la.alternate_arrangements,
        la.contact_during_leave,
        u.id as applicant_id,
        u.name as applicant_name,
        u.department as applicant_department
      FROM leave_applications la
      JOIN users u ON la.applicant_id = u.id
      WHERE la.status = 'pending'
      ORDER BY la.created_at DESC
    `);

    const filtered = result.rows.filter((leave) => {
      const chain = typeof leave.approval_chain === 'string'
        ? JSON.parse(leave.approval_chain)
        : leave.approval_chain;

      return chain.some(
        (step) => step.role === role && step.status === 'pending'
      );
    });

    const approvals = filtered.map((leave) => ({
      id: leave.id.toString(),
      applicantId: leave.applicant_id.toString(),
      applicantName: leave.applicant_name,
      applicantDepartment: leave.applicant_department,
      leaveType: leave.leave_type,
      startDate: leave.start_date,
      endDate: leave.end_date,
      reason: leave.reason,
      isUrgent: leave.is_urgent,
      status: leave.status,
      createdAt: leave.created_at,
      updatedAt: leave.updated_at,
      documents: leave.documents || [],
      approvalChain: Array.isArray(leave.approval_chain)
      ? leave.approval_chain
      : JSON.parse(leave.approval_chain || '[]'),
      currentApprover: leave.current_approver,
      alternateArrangements: leave.alternate_arrangements,
      contactDuringLeave: leave.contact_during_leave
    }));

    res.json(approvals);
  } catch (err) {
    console.error('Error in getPendingApprovals:', err);
    res.status(500).json({ message: 'Failed to fetch pending approvals' });
  }
};

const handleLeaveDecision = async (req, res) => {
  const { leaveId, action, approverRole, comment } = req.body;

  try {
    // 1. Get the existing leave application
    const result = await pool.query('SELECT * FROM leave_applications WHERE id = $1', [leaveId]);
    const leave = result.rows[0];

    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    // 2. Parse approval chain
    let chain;
    try {
      chain = Array.isArray(leave.approval_chain)
        ? leave.approval_chain
        : JSON.parse(leave.approval_chain || '[]');
    } catch (err) {
      console.error('Failed to parse approval_chain:', leave.approval_chain, err);
      return res.status(500).json({ message: 'Invalid approval chain format' });
    }

    // 3. Update the current approver's step
    const updatedChain = chain.map(step =>
      step.role === approverRole
        ? {
            ...step,
            status: action,
            comment,
            timestamp: new Date().toISOString(),
          }
        : step
    );

    // 4. Find the next approver (if any)
    const currentIndex = chain.findIndex(step => step.role === approverRole);
    const nextApprover = chain[currentIndex + 1]?.role;

    // 5. Determine final status
    const finalStatus = action === 'reject' ? 'rejected' : nextApprover ? 'pending' : 'approved';

    // 6. Update the leave record
    await pool.query(
      `UPDATE leave_applications 
       SET approval_chain = $1,
           current_approver = $2,
           status = $3,
           updated_at = NOW()
       WHERE id = $4`,
      [JSON.stringify(updatedChain), nextApprover || approverRole, finalStatus, leaveId]
    );

    // 7. Notify applicant with status update
    await pool.query(
      `INSERT INTO notifications (user_id, message, is_read, created_at, type)
       VALUES ($1, $2, FALSE, NOW(), $3)`,
      [
        leave.applicant_id,
        `Your ${leave.leave_type} leave has been ${finalStatus} by ${approverRole.toUpperCase()}`,
        'status'
      ]
    );

    // 8. Notify next approver (if any)
    if (nextApprover && finalStatus === 'pending') {
    
      const approverResult = await pool.query(
        'SELECT id FROM users WHERE role = $1 LIMIT 1',
        [nextApprover]
      );
    
      const nextApproverId = approverResult.rows[0]?.id;
    
      if (nextApproverId) {
        await pool.query(
          `INSERT INTO notifications (user_id, message, is_read, created_at, type)
           VALUES ($1, $2, FALSE, NOW(), $3)`,
          [
            nextApproverId,
            `${leave.applicant_name || 'A user'} submitted a ${leave.leave_type} leave request.`,
            'approval'
          ]
        );
      }
    }

    res.status(200).json({ message: `Leave ${action}d successfully` });
  } catch (error) {
    console.error('Error in handleLeaveDecision:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getLeaveUsageStats = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const result = await pool.query(`
      SELECT
        TO_CHAR(created_at, 'Mon') AS month,
        leave_type,
        COUNT(*) AS count
      FROM leave_applications
      WHERE applicant_id = $1 AND status = 'approved'
        AND created_at >= DATE_TRUNC('year', NOW()) -- Only this year's data
        AND created_at < DATE_TRUNC('year', NOW() + INTERVAL '1 year') -- Up to the end of this year
      GROUP BY month, leave_type
      ORDER BY MIN(created_at)
    `, [userId]);

    const monthlyData = {};
    result.rows.forEach(row => {
      const { month, leave_type, count } = row;
      if (!monthlyData[month]) monthlyData[month] = { month };
      monthlyData[month][leave_type] = Number(count);
    });

    res.json(Object.values(monthlyData));
  } catch (err) {
    console.error('Error fetching leave usage stats:', err);
    res.status(500).json({ message: 'Failed to fetch leave usage stats' });
  }
};

const getLeaveBalances = async (req, res) => {
  const { userId } = req.params;

  try {
    // ✅ Get user role first
    const userRes = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userRole = userRes.rows[0].role;

    // 1. Get all leave types with default days
    const leaveTypesRes = await pool.query('SELECT code, name, default_days FROM leave_types');
    const leaveTypes = leaveTypesRes.rows;

    // 2. Get all approved leaves for this user
    const leavesRes = await pool.query(
      `SELECT leave_type, start_date, end_date
       FROM leave_applications
       WHERE applicant_id = $1 AND status = 'approved'`,
      [userId]
    );

    const appliedLeaves = leavesRes.rows;

    // ✅ Filter ACL for adhoc only
    const filteredTypes = leaveTypes.filter(type => {
      if (userRole === 'adhoc') return type.code === 'ACL';
      return type.code !== 'ACL';
    });

    // 3. Calculate usage per leave type
    const balances = filteredTypes.map((type) => {
      const usedDays = appliedLeaves
        .filter(leave => leave.leave_type === type.code)
        .reduce((sum, leave) => {
          const start = new Date(leave.start_date);
          const end = new Date(leave.end_date);
          return sum + (differenceInBusinessDays(end, start) + 1);
        }, 0);

      return {
        type: type.code,
        name: type.name,
        total: type.default_days,
        used: usedDays,
        remaining: Math.max(type.default_days - usedDays, 0)
      };
    });

    res.json(balances);
  } catch (err) {
    console.error('Error fetching leave balances:', err);
    res.status(500).json({ message: 'Failed to fetch leave balances' });
  }
};

module.exports = {
  submitLeaveApplication,
  getUserLeaves,
  getPendingApprovals,
  handleLeaveDecision,
  getLeaveUsageStats,
  getLeaveBalances
};
