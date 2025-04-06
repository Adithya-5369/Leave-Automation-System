import { User, UserRole } from '../context/AuthContext';

export type LeaveType = 
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
  | 'EOL' // Extra Ordinary Leave
  | 'AHL'; // Adhoc Leave

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
  status: LeaveStatus;
  createdAt: Date;
  updatedAt: Date;
  documents?: string[];
  approvalChain: ApprovalStep[];
  currentApprover: UserRole;
  alternateArrangements?: string;
  contactDuringLeave?: string;
}

export interface LeavePolicy {
  leaveType: LeaveType;
  maxDuration: number;
  eligibleRoles: string[];
  description: string;
  approvalHierarchy: string[];
  documents?: string[];
  specialConditions?: string;
  eligibleEmployeeTypes?: string[];
}

export const LEAVE_TYPES: Record<LeaveType, string> = {
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
  EOL: 'Extra Ordinary Leave',
  AHL: 'Leave (Adhoc)'
};

export const LEAVE_POLICIES: LeavePolicy[] = [
  {
    leaveType: 'CL',
    maxDuration: 8,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Casual leave for short absences',
    approvalHierarchy: ['hod', 'dean fa', 'director'],
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'EL',
    maxDuration: 30,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Earned leave accumulated based on service',
    approvalHierarchy: ['hod', 'dean fa', ' director'],
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'SPCL',
    maxDuration: 15,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Special casual leave for conferences, workshops, etc.',
    approvalHierarchy: ['hod', 'dean fa', 'dy. director'],
    documents: ['Invitation Letter', 'Conference Details'],
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'ML',
    maxDuration: 180,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Maternity leave for female employees',
    approvalHierarchy: ['hod', 'dean fa', 'dy. director'],
    documents: ['Medical Certificate'],
    specialConditions: 'Available for female employees only',
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'OD',
    maxDuration: 15,
    eligibleRoles: ['faculty', 'hod', 'dean'],
    description: 'On duty leave for official work outside the institute',
    approvalHierarchy: ['hod', 'dean fa', 'director'],
    documents: ['Invitation Letter', 'Official Work Details'],
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'PL',
    maxDuration: 15,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Paternity leave for male employees',
    approvalHierarchy: ['hod', 'dean fa', 'director'],
    specialConditions: 'Available for male employees only',
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'CCL',
    maxDuration: 730,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Child Care Leave for female employees with minor children',
    approvalHierarchy: ['hod', 'dean fa', 'director'],
    documents: ['Child Birth Certificate'],
    specialConditions: 'Available for female employees with children under 18 years',
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'SL',
    maxDuration: 30,
    eligibleRoles: ['faculty', 'hod', 'dean', 'registrar'],
    description: 'Station Leave for leaving headquarters during holidays or casual leave',
    approvalHierarchy: ['hod', 'dean fa'],
    eligibleEmployeeTypes: ['regular']
  },
  {
    leaveType: 'AHL',
    maxDuration: 12,
    eligibleRoles: ['adhoc'],
    description: 'Leave for adhoc faculty members',
    approvalHierarchy: ['hod'],
    eligibleEmployeeTypes: ['adhoc']
  }
];

