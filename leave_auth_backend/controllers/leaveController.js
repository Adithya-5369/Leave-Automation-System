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
    documents,
    approvalChain,
    currentApprover
  } = req.body;

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

const applyLeave = async (req, res) => {
  const { userId, leaveType, reason, startDate, endDate } = req.body;

  try {
    const newLeave = await pool.query(`
      INSERT INTO leave_applications (user_id, leave_type, reason, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [userId, leaveType, reason, startDate, endDate]);

    const leaveId = newLeave.rows[0].id;

    // Pre-fill approval steps
    await pool.query(`
      INSERT INTO leave_approvals (leave_id, role)
      VALUES 
        ($1, 'hod'),
        ($1, 'dean')`,
      [leaveId]);

    res.status(201).json({ message: 'Leave applied', leave: newLeave.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Leave application failed' });
  }
};

const getUserLeaves = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(`
      SELECT la.*, json_agg(
        json_build_object(
          'role', a.role,
          'status', a.status,
          'comment', a.comment,
          'date', a.decision_date
        )
      ) AS approvals
      FROM leave_applications la
      LEFT JOIN leave_approvals a ON la.id = a.leave_id
      WHERE la.user_id = $1
      GROUP BY la.id
      ORDER BY la.applied_on DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch leaves' });
  }
};


module.exports = {
  submitLeaveApplication,
  applyLeave,
  getUserLeaves
};
