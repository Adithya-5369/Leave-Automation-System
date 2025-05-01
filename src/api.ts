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


/* interface LeaveData {
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  file?: File;
  status?: string;
  appliedOn?: string;
  approverComments?: string;
  approvalChain?: string[];
  currentApprover?: string;
}

export const submitLeave = async (leaveData: LeaveData) => {
  const formData = new FormData();

  Object.entries(leaveData).forEach(([key, value]) => {
    if (key === 'file' && value instanceof File) {
      formData.append('file', value);
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  const res = await axios.post(`${API_BASE_URL}/auth/leaves`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};


export const fetchUserLeaves = async (userId: string) => {
  const res = await axios.get(`${API_BASE_URL}/auth/leaves/${userId}`);
  return res.data;
}; */