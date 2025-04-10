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

module.exports = {
  submitLeaveApplication
};
