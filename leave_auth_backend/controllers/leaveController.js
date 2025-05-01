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

  /*const uploadedFiles = req.files ? req.files.map(file => file.filename) : [];*/

  const uploadedFiles = req.files
    ? req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`)
    : [];

  try {
    const result = await pool.query(
      `INSERT INTO leave_applications 
      (applicant_id, leave_type, start_date, end_date, reason, is_urgent,
      alternate_arrangements, contact_during_leave, documents, approval_chain, current_approver) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        applicantId,
        leaveType,
        startDate,
        endDate,
        reason,
        isUrgent,
        alternateArrangements,
        contactDuringLeave,
        uploadedFiles,
        JSON.stringify(approvalChain),
        currentApprover
      ]
    );

    res.status(201).json({ message: 'Leave submitted', application: result.rows[0] });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ message: 'Error submitting leave' });
  }
};


/*const submitLeaveApplication = async (req, res) => {
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
};*/

/* const applyLeave = async (req, res) => {
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
}; */

  /*const getUserLeaves = async (req, res) => {
    const { userId } = req.params;

    try {
      const result = await pool.query(
        `SELECT *,
          to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') as "createdAt",
          to_char(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') as "updatedAt"
        FROM leave_applications
        WHERE applicant_id = $1
        ORDER BY created_at DESC`,
        [userId]
      );

      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch leaves' });
    }
  };*/

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


module.exports = {
  submitLeaveApplication,
  getUserLeaves
};
