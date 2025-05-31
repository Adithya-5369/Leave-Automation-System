const API_BASE_URL = 'http://localhost:5000/api';

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return res.json();
};

export const sendOtp = async (email: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
};

interface LeaveData {
  applicantId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  isUrgent: boolean;
  alternateArrangements: string;
  contactDuringLeave: string;
  approvalChain: string[];
  currentApprover: string;
  documents?: File[];
}

export const submitLeave = async (leaveData: LeaveData) => {
  const formData = new FormData();

  Object.entries(leaveData).forEach(([key, value]) => {
    if (key === 'documents' && Array.isArray(value)) {
      value.forEach((file) => formData.append('documents', file));
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      formData.append(key, value.toString());
    }
  });

  const res = await fetch(`${API_BASE_URL}/auth/leaves/apply`, {
    method: 'POST',
    body: formData,
  });

  return res.json();
};


export const fetchUserLeaves = async (userId: string) => {
  const res = await fetch(`${API_BASE_URL}/leaves/${userId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch leaves');
  }
  return res.json();
};

export const updateLeaveBalance = async (userId: string, leaveType: string, days: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/leaves/update-balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, leaveType, days }),
    });

    if (!response.ok) {
      throw new Error('Failed to update leave balance');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating leave balance:', error);
    throw error;
  }
};

export const getLeaveBalances = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/leaves/balances/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leave balances');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching leave balances:', error);
    throw error;
  }
};

export const fetchPendingApprovals = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/leaves/pending/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch pending approvals');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    throw error;
  }
};

export const submitLeaveDecision = async ({
  leaveId,
  action,
  approverRole,
  comment,
}: {
  leaveId: string;
  action: 'approve' | 'reject';
  approverRole: string;
  comment: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/auth/leaves/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leaveId, action, approverRole, comment }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to submit decision');
  }

  return res.json();
};

export const fetchNotifications = async (userId: string) => {
  const res = await fetch(`${API_BASE_URL}/notifications/${userId}`);
  return res.json();
};

export const markNotificationAsRead = async (id: number) => {
  await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: 'PUT',
  });
};

export const addNotification = async (userId: string, message: string) => {
  await fetch(`${API_BASE_URL}/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, message }),
  });
};

export const fetchLeaveUsageByMonth = async (userId: string) => {
  const res = await fetch(`http://localhost:5000/auth/leave/usage/monthly/?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch usage stats');
  return res.json();
};

export const fetchLeaveBalances = async (userId: string) => {
  const response = await fetch(`http://localhost:5000/auth/leave/balances/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch leave balances');
    return await response.json();
};
