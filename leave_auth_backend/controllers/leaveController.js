const pool = require('../db');

const submitLeaveApplication = async (req, res) => {
  const {
    applicantId,
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
  const documents = req.files?.map(file => file.filename) || [];

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

const updateLeaveBalance = async (req, res) => {
  const { userId, leaveType, days } = req.body;

  try {
    // First check if the user has a leave balance record
    const checkResult = await pool.query(
      `SELECT * FROM leave_balances 
       WHERE user_id = $1 AND leave_type = $2`,
      [userId, leaveType]
    );

    if (checkResult.rows.length === 0) {
      // If no record exists, create one with default values
      await pool.query(
        `INSERT INTO leave_balances (user_id, leave_type, total, used, remaining)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, leaveType, 30, days, 30 - days] // Default total of 30 days
      );
    } else {
      // Update existing record
      const currentBalance = checkResult.rows[0];
      const newUsed = currentBalance.used + days;
      const newRemaining = currentBalance.total - newUsed;

      await pool.query(
        `UPDATE leave_balances 
         SET used = $1, remaining = $2
         WHERE user_id = $3 AND leave_type = $4`,
        [newUsed, newRemaining, userId, leaveType]
      );
    }

    res.status(200).json({ message: 'Leave balance updated successfully' });
  } catch (err) {
    console.error('Error updating leave balance:', err);
    res.status(500).json({ message: 'Failed to update leave balance' });
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

    res.status(200).json({ message: `Leave ${action}d successfully` });
  } catch (error) {
    console.error('Error in handleLeaveDecision:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  submitLeaveApplication,
  getUserLeaves,
  updateLeaveBalance,
  getPendingApprovals,
  handleLeaveDecision
};
