import { User, UserRole } from '../context/AuthContext';

export type LeaveType = 
    'ACL' // Adhoc Casual Leave
  | 'CL' // Casual Leave
  | 'RH' // Restricted Holiday
  | 'EL' // Earned Leave
  | 'HPL' // Half Pay Leave
  | 'SPCL' // Special Casual Leave
  | 'ML' // Maternity Leave
  | 'PL' // Paternity Leave
  | 'CCL' // Child Care Leave
  | 'VL' // Vacation Leave
  | 'SL' // Station Leave
  | 'OD' // On Duty Leave
  | 'EOL'; // Extra Ordinary Leave

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'forwarded';

export interface LeaveBalance {
  leaveType: LeaveType;
  total: number;
  used: number;
  remaining: number;
}

export interface ApprovalStep {
  role: UserRole;
  status: LeaveStatus;
  comment?: string;
  timestamp?: Date;
  user?: User;
}

// Final frontend format (for displaying in dashboard)
export interface LeaveApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantDepartment: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  isUrgent: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  approvalChain: {
    role: string;
    status: string;
    comment?: string;
    timestamp?: Date;
  }[];
  currentApprover: string;
  alternateArrangements?: string;
  contactDuringLeave?: string;
  documents?: string[];
}

// Raw format from backend API
export interface LeaveApplicationRaw {
  id: string;
  applicant_id: string;
  applicant_name: string;
  applicant_department: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  is_urgent: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  approval_chain: {
    role: string;
    status: string;
    comment?: string;
    timestamp?: string;
  }[];
  current_approver: string;
  alternate_arrangements?: string;
  contact_during_leave?: string;
  documents?: string[];
}


export interface LeavePolicy {
  leaveType: LeaveType;
  maxDuration: number | null;
  eligibleRoles: string[];
  description: string;
  approvalHierarchy: string[];
  documents?: string[];
  specialConditions?: string;
  eligibleEmployeeTypes?: string[];
}

export const LEAVE_TYPES: Record<LeaveType, string> = {
  ACL: 'Adhoc Casual Leave',
  CL: 'Casual Leave',
  RH: 'Restricted Holiday',
  EL: 'Earned Leave',
  HPL: 'Half Pay Leave',
  SPCL: 'Special Casual Leave',
  ML: 'Maternity Leave',
  PL: 'Paternity Leave',
  CCL: 'Child Care Leave',
  VL: 'Vacation Leave',
  SL: 'Station Leave',
  OD: 'On Duty Leave',
  EOL: 'Extra Ordinary Leave'
};

export const LEAVE_POLICIES: LeavePolicy[] = [
  {
    leaveType: 'CL',
    maxDuration: 8,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Casual leave for short absences; not carried over year to year.',
    approvalHierarchy: ['hod', 'dean fa', 'director'],
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'RH',
    maxDuration: 2,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar', 'non-teaching'],
    description: 'Restricted Holidays chosen from the list of optional holidays.',
    approvalHierarchy: ['hod'],
    documents: ['RH Selection Form'],
    eligibleEmployeeTypes: ['regular']
  },  
  {
    leaveType: 'EL',
    maxDuration: 300,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar', 'director'],
    description: 'Earned leave accumulated based on service; encashable and carried forward.',
    approvalHierarchy: ['hod', 'dean fa', ' director'],
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'HPL',
    maxDuration: 20, // Credited 20 days/year (10 + 10 in Jan/July)
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Leave earned at half pay, usable with or without medical certificate.',
    approvalHierarchy: ['hod', 'dean fa'],
    eligibleEmployeeTypes: ['regular']
  },  
  {
    leaveType: 'SPCL',
    maxDuration: 10,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Special casual leave for conferences, workshops, and external duties.',
    approvalHierarchy: ['hod', 'dean fa', 'dy. director'],
    documents: ['Invitation Letter', 'Conference Details'],
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'ML',
    maxDuration: 180,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Maternity leave for female employees; available for first two surviving children.',
    approvalHierarchy: ['hod', 'dean fa', 'dy. director'],
    documents: ['Medical Certificate'],
    specialConditions: 'Available for female employees only',
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'OD',
    maxDuration: 15,
    eligibleRoles: ['faculty', 'hod', 'dean'],
    description: 'On duty leave for official assignments, inspections, paper-setting, etc.',
    approvalHierarchy: ['hod', 'dean fa', 'director'],
    documents: ['Invitation Letter', 'Official Work Details'],
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'PL',
    maxDuration: 15,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Paternity leave for male employees during childbirth.',
    approvalHierarchy: ['hod', 'dean fa', 'director'],
    specialConditions: 'Available for male employees only',
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'CCL',
    maxDuration: 730,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Child Care Leave for female employees with minor children.',
    approvalHierarchy: ['hod', 'dean fa', 'director'],
    documents: ['Child Birth Certificate'],
    specialConditions: 'Available for female employees with children under 18 years',
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'VL',
    maxDuration: null, // Depends on departmental vacation calendar
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar', 'director'],
    description: 'Vacation Leave for faculty in academic departments with vacation entitlement.',
    approvalHierarchy: ['hod', 'dean fa'],
    specialConditions: 'Applicable only to Vacation Department staff.',
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'SL',
    maxDuration: 30,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Station Leave for going out of headquarters during off days or leave.',
    approvalHierarchy: ['hod', 'dean fa'],
    documents: ['Outstation Details', 'Leave Sanction Copy'],
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'EOL',
    maxDuration: 90, // 5 years max in general
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Leave without pay for personal, medical, or academic purposes when other leave is exhausted.',
    approvalHierarchy: ['hod', 'dean fa', 'director'],
    documents: ['Leave Application with Justification', 'Supporting Certificates (if medical/study)'],
    specialConditions: 'Max 5 years for permanent staff; variable for temporary.',
    eligibleEmployeeTypes: ['regular']
  },  
  {
    leaveType: 'ACL',
    maxDuration: 10,
    eligibleRoles: ['adhoc'],
    description: 'Adhoc Casual Leave for temporary/adhoc faculty.',
    approvalHierarchy: ['hod'],
    eligibleEmployeeTypes: ['adhoc']
  }
];

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string | Date;
  type: 'approval' | 'status' | 'reminder' | 'system' | 'general';
}

