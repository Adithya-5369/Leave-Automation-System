import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LeaveBalance, LeaveApplication, LEAVE_TYPES } from '../../types/leave';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, differenceInDays } from 'date-fns';

// Mock data
const mockLeaveBalances: LeaveBalance[] = [
  { leaveType: 'CL', total: 8, used: 2, remaining: 6 },
  { leaveType: 'EL', total: 30, used: 5, remaining: 25 },
  { leaveType: 'SPCL', total: 15, used: 0, remaining: 15 },
  { leaveType: 'OD', total: 15, used: 3, remaining: 12 },
  { leaveType: 'RH', total: 2, used: 0, remaining: 2 },
  { leaveType: 'AHL', total: 30, used: 12, remaining: 18 },
];

const mockRecentLeaves: LeaveApplication[] = [
  {
    id: '1',
    applicantId: '1',
    applicantName: 'Faculty 1',
    applicantDepartment: 'Computer Science',
    leaveType: 'CL',
    startDate: new Date(2025, 3, 10),
    endDate: new Date(2025, 3, 12),
    reason: 'Personal work',
    isUrgent: false,
    status: 'approved',
    createdAt: new Date(2025, 3, 5),
    updatedAt: new Date(2025, 3, 6),
    approvalChain: [
      { role: 'hod', status: 'approved', timestamp: new Date(2025, 3, 6) },
      { role: 'dean', status: 'approved', timestamp: new Date(2025, 3, 6) }
    ],
    currentApprover: 'dean'
  },
  {
    id: '2',
    applicantId: '1',
    applicantName: 'Faculty 2',
    applicantDepartment: 'Computer Science',
    leaveType: 'OD',
    startDate: new Date(2025, 4, 15),
    endDate: new Date(2025, 4, 17),
    reason: 'Conference attendance',
    isUrgent: false,
    status: 'pending',
    createdAt: new Date(2025, 4, 1),
    updatedAt: new Date(2025, 4, 1),
    approvalChain: [
      { role: 'hod', status: 'approved', timestamp: new Date(2025, 4, 2) },
      { role: 'dean', status: 'pending' }
    ],
    currentApprover: 'dean'
  },
  {
    id: '3',
    applicantId: '1',
    applicantName: 'Faculty 3',
    applicantDepartment: 'Computer Science',
    leaveType: 'SPCL',
    startDate: new Date(2025, 2, 20),
    endDate: new Date(2025, 2, 25),
    reason: 'Workshop at IIT Delhi',
    isUrgent: false,
    status: 'rejected',
    createdAt: new Date(2025, 2, 10),
    updatedAt: new Date(2025, 2, 12),
    approvalChain: [
      { role: 'hod', status: 'approved', timestamp: new Date(2025, 2, 11) },
      { role: 'dean', status: 'rejected', timestamp: new Date(2025, 2, 12), comment: 'Insufficient details provided' }
    ],
    currentApprover: 'dean'
  },
  {
    id: '4',
    applicantId: '1',
    applicantName: 'Adhoc Faculty',
    applicantDepartment: 'Computer Science',
    leaveType: 'AHL',
    startDate: new Date(2025, 3, 1), // April 1, 2025
    endDate: new Date(2025, 3, 4),   // April 4, 2025 (4 days)
    reason: 'Personal reasons',
    isUrgent: false,
    status: 'approved',
    createdAt: new Date(2025, 2, 25),
    updatedAt: new Date(2025, 2, 26),
    approvalChain: [
      { role: 'hod', status: 'approved', timestamp: new Date(2025, 2, 26) }
    ],
    currentApprover: 'hod'
  },
  {
    id: '5',
    applicantId: '1',
    applicantName: 'Adhoc Faculty',
    applicantDepartment: 'Computer Science',
    leaveType: 'AHL',
    startDate: new Date(2025, 1, 10), // Feb 10, 2025
    endDate: new Date(2025, 1, 12),   // Feb 12, 2025 (3 days)
    reason: 'Medical appointment',
    isUrgent: true,
    status: 'pending',
    createdAt: new Date(2025, 1, 5),
    updatedAt: new Date(2025, 1, 5),
    approvalChain: [
      { role: 'hod', status: 'pending' }
    ],
    currentApprover: 'hod'
  }
];

const mockPendingApprovals: LeaveApplication[] = [
  {
    id: '4',
    applicantId: '6',
    applicantName: 'Faculty 4',
    applicantDepartment: 'Computer Science',
    leaveType: 'CL',
    startDate: new Date(2025, 4, 25),
    endDate: new Date(2025, 4, 26),
    reason: 'Family function',
    isUrgent: true,
    status: 'pending',
    createdAt: new Date(2025, 4, 20),
    updatedAt: new Date(2025, 4, 20),
    approvalChain: [
      { role: 'hod', status: 'pending' }
    ],
    currentApprover: 'hod'
  },
  {
    id: '5',
    applicantId: '7',
    applicantName: 'Faculty 5',
    applicantDepartment: 'Computer Science',
    leaveType: 'OD',
    startDate: new Date(2025, 5, 5),
    endDate: new Date(2025, 5, 10),
    reason: 'International conference',
    isUrgent: false,
    status: 'pending',
    createdAt: new Date(2025, 4, 15),
    updatedAt: new Date(2025, 4, 15),
    approvalChain: [
      { role: 'hod', status: 'pending' }
    ],
    currentApprover: 'hod'
  },
  {
    id: '6',
    applicantId: '8',
    applicantName: 'Adhoc Faculty',
    applicantDepartment: 'Computer Science',
    leaveType: 'AHL',
    startDate: new Date(2025, 3, 5),
    endDate: new Date(2025, 3, 10),
    reason: 'Personal work',
    isUrgent: false,
    status: 'pending',
    createdAt: new Date(2025, 4, 15),
    updatedAt: new Date(2025, 4, 15),
    approvalChain: [
      { role: 'hod', status: 'pending' }
    ],
    currentApprover: 'hod'
  }
];

const leaveUsageData = [
  { name: 'Jan', CL: 1, EL: 0, SPCL: 0, OD: 0, AHL: 2 },
  { name: 'Feb', CL: 0, EL: 2, SPCL: 0, OD: 1, AHL: 3 },
  { name: 'Mar', CL: 1, EL: 0, SPCL: 5, OD: 0, AHL: 1 },
  { name: 'Apr', CL: 0, EL: 3, SPCL: 0, OD: 2, AHL: 4 },
  { name: 'May', CL: 0, EL: 0, SPCL: 0, OD: 0, AHL: 1 },
  { name: 'Jun', CL: 0, EL: 0, SPCL: 0, OD: 0, AHL: 1 },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [recentLeaves, setRecentLeaves] = useState<LeaveApplication[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<LeaveApplication[]>([]);

  useEffect(() => {
    // Simulate API calls
    setLeaveBalances(mockLeaveBalances);
    setRecentLeaves(mockRecentLeaves);
    
    if (user && ['hod', 'dean', 'director', 'registrar'].includes(user.role)) {
      setPendingApprovals(mockPendingApprovals);
    }
  }, [user]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      case 'pending':
        return 'badge-pending';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeaveDuration = (start: Date, end: Date) => {
    const days = differenceInDays(end, start) + 1;
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
        <p className="mt-1 text-orange-100">
          {user?.role === 'adhoc' && 'Adhoc Faculty'}
          {user?.role === 'faculty' && 'Faculty'}
          {user?.role === 'hod' && 'Head of Department'}
          {user?.role === 'dean' && 'Dean'}
          {user?.role === 'registrar' && 'Registrar'}
          {user?.role === 'director' && 'Director'}
          {user?.role === 'admin' && 'Administrator'}
          {user?.department && ` • ${user.department}`}
        </p>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/leave-application')}
          className="card hover:shadow-lg transition-shadow flex items-center p-4"
        >
          <div className="rounded-full bg-orange-100 p-3 mr-4">
            <FileText className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Apply for Leave</h3>
            <p className="text-sm text-gray-500">Submit a new leave application</p>
          </div>
        </button>
        
        <button
          onClick={() => navigate('/leave-status')}
          className="card hover:shadow-lg transition-shadow flex items-center p-4"
        >
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Check Status</h3>
            <p className="text-sm text-gray-500">View your leave applications</p>
          </div>
        </button>
        
        {user && ['hod', 'dean', 'registrar', 'director'].includes(user.role) && (
          <button
            onClick={() => navigate('/approvals')}
            className="card hover:shadow-lg transition-shadow flex items-center p-4"
          >
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Pending Approvals</h3>
              <p className="text-sm text-gray-500">
                {pendingApprovals.length} request{pendingApprovals.length !== 1 ? 's' : ''} waiting
              </p>
            </div>
          </button>
        )}
      </div>
      
      {/* Leave balances */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Leave Balances</h2>
          <div className="text-sm text-gray-500">Academic Year 2025-26</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {leaveBalances
            .filter((leave) => {
              if (user?.role === 'adhoc') {
                return leave.leaveType === 'AHL'; // Show only AHL for adhoc users
              } else {
                return leave.leaveType !== 'AHL'; // Show all except AHL for non adhoc users
              }
            })
            .map((leave) => (
            <div key={leave.leaveType} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">{LEAVE_TYPES[leave.leaveType]}</span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {leave.leaveType}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{leave.remaining}</div>
              <div className="text-xs text-gray-500 mt-1">
                Used: {leave.used} / {leave.total}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-orange-500 h-1.5 rounded-full" 
                  style={{ width: `${(leave.used / leave.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent leave applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Applications</h2>
            <button 
              onClick={() => navigate('/leave-status')}
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              View all
            </button>
          </div>
          
          {recentLeaves
            .filter((leave) => {
              if (user?.role === 'adhoc') {
                return leave.leaveType === 'AHL'; // Show only AHL for adhoc users
              } else {
                return leave.leaveType !== 'AHL'; // Show all except AHL for non-adhoc users
              }
            })
            .length > 0 ? (
              <div className="space-y-4">
                {recentLeaves
                  .filter((leave) => {
                    if (user?.role === 'adhoc') {
                      return leave.leaveType === 'AHL';
                    } else {
                      return leave.leaveType !== 'AHL';
                    }
                  })
                  .map((leave) => (
                    <div key={leave.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {LEAVE_TYPES[leave.leaveType]}
                            </span>
                            <span className="ml-2 badge bg-gray-100 text-gray-800">
                              {leave.leaveType}
                            </span>
                            {leave.isUrgent && (
                              <span className="ml-2 badge-urgent flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Urgent
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(leave.startDate, 'MMM dd, yyyy')} - {format(leave.endDate, 'MMM dd, yyyy')}
                            <span className="mx-1">•</span>
                            {getLeaveDuration(leave.startDate, leave.endDate)}
                          </p>
                          <p className="text-sm text-gray-700 mt-2">{leave.reason}</p>
                        </div>
                        <span className={`badge ${getStatusBadgeClass(leave.status)}`}>
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </span>
                      </div>
                      
                      {leave.status !== 'pending' && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                          {leave.status === 'approved' ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved by {leave.approvalChain[leave.approvalChain.length - 1].role.toUpperCase()}
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="h-3 w-3 mr-1" />
                              Rejected by {leave.approvalChain[leave.approvalChain.length - 1].role.toUpperCase()}
                              {leave.approvalChain[leave.approvalChain.length - 1].comment && (
                                <span className="ml-1">
                                  : {leave.approvalChain[leave.approvalChain.length - 1].comment}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p>No recent leave applications</p>
              </div>
            )}
        </div>
        
        {/* Leave usage chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Leave Usage Trends</h2>
            <div className="text-sm text-gray-500">Last 6 months</div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leaveUsageData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {user?.role === 'adhoc' ? (
                <Bar dataKey="AHL" name="Adhoc Leave" fill="#f59e0b" />
              ) : (
                <>
                  <Bar dataKey="CL" name="Casual Leave" fill="#f97316" />
                  <Bar dataKey="EL" name="Earned Leave" fill="#3b82f6" />
                  <Bar dataKey="SPCL" name="Special CL" fill="#10b981" />
                  <Bar dataKey="OD" name="On Duty" fill="#8b5cf6" />
                </>
              )}
            </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Pending approvals section for approvers */}
      {user && ['hod', 'dean', 'registrar', 'director'].includes(user.role) && pendingApprovals.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Pending Approvals</h2>
            <button 
              onClick={() => navigate('/approvals')}
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              View all
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingApprovals.map((leave) => (
                  <tr key={leave.id} className={leave.isUrgent ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {leave.applicantName}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{leave.applicantDepartment}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{LEAVE_TYPES[leave.leaveType]}</div>
                      <div className="text-xs text-gray-500">{leave.leaveType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(leave.startDate, 'MMM dd')} - {format(leave.endDate, 'MMM dd')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getLeaveDuration(leave.startDate, leave.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getStatusBadgeClass(leave.status)}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                      {leave.isUrgent && (
                        <span className="ml-2 badge-urgent flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Urgent
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate('/approvals')}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;