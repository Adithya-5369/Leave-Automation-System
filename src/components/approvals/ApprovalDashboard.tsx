import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LeaveApplication, LEAVE_TYPES } from '../../types/leave';
import { format, differenceInDays, isBefore } from 'date-fns';
import toast from 'react-hot-toast';
import { fetchPendingApprovals, submitLeaveDecision } from '../../api';

// Mock data
/*const mockPendingApprovals: LeaveApplication[] = [
  {
    id: '1',
    applicantId: '6',
    applicantName: 'Faculty 5',
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
    currentApprover: 'hod',
    alternateArrangements: 'Classes will be rescheduled',
    contactDuringLeave: '+91 9876543210'
  },
  {
    id: '2',
    applicantId: '7',
    applicantName: 'Faculty 4',
    applicantDepartment: 'Computer Science',
    leaveType: 'OD',
    startDate: new Date(2025, 5, 5),
    endDate: new Date(2025, 5, 10),
    reason: 'International conference on Advanced Computing at Singapore',
    isUrgent: false,
    status: 'pending',
    createdAt: new Date(2025, 4, 15),
    updatedAt: new Date(2025, 4, 15),
    approvalChain: [
      { role: 'hod', status: 'pending' }
    ],
    currentApprover: 'hod',
    alternateArrangements: 'Classes will be handled by PhD Scholar',
    contactDuringLeave: '+91 9876543210, email@example.com'
  },
  {
    id: '3',
    applicantId: '8',
    applicantName: 'Faculty 3',
    applicantDepartment: 'Computer Science',
    leaveType: 'EL',
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 6, 15),
    reason: 'Family vacation',
    isUrgent: false,
    status: 'pending',
    createdAt: new Date(2025, 5, 10),
    updatedAt: new Date(2025, 5, 10),
    approvalChain: [
      { role: 'hod', status: 'pending' }
    ],
    currentApprover: 'hod',
    alternateArrangements: 'Classes will be handled by Ms. Samiridhi',
    contactDuringLeave: '+91 9876543210'
  },
  {
    id: '4',
    applicantId: '9',
    applicantName: 'Faculty 2',
    applicantDepartment: 'Electrical Engineering',
    leaveType: 'SPCL',
    startDate: new Date(2025, 5, 20),
    endDate: new Date(2025, 5, 25),
    reason: 'Workshop on Renewable Energy at IIT Madras',
    isUrgent: false,
    status: 'forwarded',
    createdAt: new Date(2025, 5, 1),
    updatedAt: new Date(2025, 5, 2),
    approvalChain: [
      { role: 'hod', status: 'approved', timestamp: new Date(2025, 5, 2), comment: 'Recommended' },
      { role: 'dean', status: 'pending' }
    ],
    currentApprover: 'dean',
    alternateArrangements: 'Classes will be rescheduled',
    contactDuringLeave: '+91 9876543210'
  },
  {
    id: '5',
    applicantId: '10',
    applicantName: 'Faculty 1',
    applicantDepartment: 'Mechanical Engineering',
    leaveType: 'ML',
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 8, 30),
    reason: 'Maternity leave',
    isUrgent: false,
    status: 'forwarded',
    createdAt: new Date(2025, 5, 15),
    updatedAt: new Date(2025, 5, 17),
    approvalChain: [
      { role: 'hod', status: 'approved', timestamp: new Date(2025, 5, 16), comment: 'Recommended' },
      { role: 'dean', status: 'approved', timestamp: new Date(2025, 5, 17), comment: 'Approved' },
      { role: 'director', status: 'pending' }
    ],
    currentApprover: 'director',
    alternateArrangements: 'Classes will be handled by PhD scholars',
    contactDuringLeave: '+91 9876543210'
  }
];*/

const ApprovalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState<LeaveApplication[]>([]);
  const [expandedLeave, setExpandedLeave] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterUrgent, setFilterUrgent] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [selectedLeaves, setSelectedLeaves] = useState<string[]>([]);
  const [showBulkComment, setShowBulkComment] = useState<boolean>(false);

  useEffect(() => {
    const fetchApprovals = async () => {
      
      try {

      if (!user?.role) return;
  
        const data = await fetchPendingApprovals(user?.role);
        console.log("Pending approvals response:", data);
        const parsed = data
        .map((leave: LeaveApplication) => {
        
          return {
            id: leave.id,
            applicantId: leave.applicantId,
            applicantName: leave.applicantName,
            applicantDepartment: leave.applicantDepartment,
            leaveType: leave.leaveType,
            startDate: new Date(leave.startDate),
            endDate: new Date(leave.endDate),
            reason: leave.reason,
            isUrgent: leave.isUrgent,
            alternateArrangements: leave.alternateArrangements,
            contactDuringLeave: leave.contactDuringLeave,
            documents: leave.documents ?? [],
            status: leave.status,
            createdAt: new Date(leave.createdAt),
            updatedAt: new Date(leave.updatedAt),
            approvalChain: (leave.approvalChain ?? []).map((step) => ({
              ...step,
              timestamp: step.timestamp ? new Date(step.timestamp) : undefined,
            })),
            currentApprover: leave.currentApprover
          };
      });
       
      setPendingApprovals(parsed);
      console.log("Pending Approvals (before filter):", pendingApprovals);
      } catch (error) {
        console.error('Error loading approvals:', error);
        toast.error('Failed to load pending approvals');
      }
    };
  
    fetchApprovals();
  }, [user]);  
  
  const toggleExpand = (id: string) => {
    if (expandedLeave === id) {
      setExpandedLeave(null);
    } else {
      setExpandedLeave(id);
    }
  };

  const toggleSelectLeave = (id: string) => {
    setSelectedLeaves(prev =>
      prev.includes(id)
        ? prev.filter(leaveId => leaveId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeaves.length === sortedApprovals.length) {
      setSelectedLeaves([]);
    } else {
      setSelectedLeaves(sortedApprovals.map(leave => leave.id));
    }
  };

  const clearSelection = () => {
    setSelectedLeaves([]);
    setShowBulkComment(false);
  };

  const handleApprove = async (id: string) => {
    if (!commentText.trim()) {
      toast.error('Please add a comment before approving');
      return;
    }
  
    try {
      await submitLeaveDecision({
        leaveId: id,
        action: 'approve',
        approverRole: user?.role ?? '',
        comment: commentText.trim(),
      });
  
      setPendingApprovals(prev => prev.filter(leave => leave.id !== id));
      setSelectedLeaves(prev => prev.filter(leaveId => leaveId !== id));
      setExpandedLeave(null);
      setCommentText('');
      toast.success('Leave application approved successfully');
    } catch (err) {
      toast.error((err instanceof Error ? err.message : 'Approval failed'));
    }
  };
  
  const handleReject = async (id: string) => {
    if (!commentText.trim()) {
      toast.error('Please add a comment before rejecting');
      return;
    }
  
    try {
      await submitLeaveDecision({
        leaveId: id,
        action: 'reject',
        approverRole: user?.role ?? '',
        comment: commentText.trim(),
      });
  
      setPendingApprovals(prev => prev.filter(leave => leave.id !== id));
      setSelectedLeaves(prev => prev.filter(leaveId => leaveId !== id));
      setExpandedLeave(null);
      setCommentText('');
      toast.success('Leave application rejected');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Rejection failed');
    }
  };
  
  const handleBulkApprove = async () => {
    if (selectedLeaves.length === 0) {
      toast.error('Please select at least one application to approve');
      return;
    }
    if (!commentText.trim()) {
      toast.error('Please add a comment before approving');
      return;
    }
  
    try {
      await Promise.all(
        selectedLeaves.map(id =>
          submitLeaveDecision({
            leaveId: id,
            action: 'approve',
            approverRole: user?.role ?? '',
            comment: commentText.trim(),
          })
        )
      );
  
      setPendingApprovals(prev => prev.filter(leave => !selectedLeaves.includes(leave.id)));
      setSelectedLeaves([]);
      setShowBulkComment(false);
      setCommentText('');
      toast.success(`${selectedLeaves.length} application(s) approved`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Approval failed');
    }
  };
  
  const handleBulkReject = async () => {
    if (selectedLeaves.length === 0) {
      toast.error('Please select at least one application to reject');
      return;
    }
    if (!commentText.trim()) {
      toast.error('Please add a comment before rejecting');
      return;
    }
  
    try {
      await Promise.all(
        selectedLeaves.map(id =>
          submitLeaveDecision({
            leaveId: id,
            action: 'reject',
            approverRole: user?.role ?? '',
            comment: commentText.trim(),
          })
        )
      );
  
      setPendingApprovals(prev => prev.filter(leave => !selectedLeaves.includes(leave.id)));
      setSelectedLeaves([]);
      setShowBulkComment(false);
      setCommentText('');
      toast.success(`${selectedLeaves.length} application(s) rejected`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Rejection failed');
    }
  };
  
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approve':
        return 'badge-approved';
      case 'reject':
        return 'badge-rejected';
      case 'pending':
        return 'badge-pending';
      case 'forwarded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getLeaveDuration = (start: Date, end: Date) => {
    const days = differenceInDays(end, start) + 1;
    return `${days} day${days > 1 ? 's' : ''}`;
  };
  
  const isLeaveStartingSoon = (date: Date) => {
    const today = new Date();
    const diffDays = differenceInDays(date, today);
    return diffDays <= 3 && diffDays >= 0;
  };
  
  const filteredApprovals = pendingApprovals.filter(leave => {
    console.log("Applicant Department:", leave.applicantDepartment);
    if (user?.role === 'hod' && leave.applicantDepartment !== user.department) {
      return false;
    }
    if (filterDepartment !== 'all' && leave.applicantDepartment !== filterDepartment) return false;
    if (filterType !== 'all' && leave.leaveType !== filterType) return false;
    if (filterUrgent && !leave.isUrgent) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        leave.applicantName?.toLowerCase().includes(term) ||
        leave.reason?.toLowerCase().includes(term) ||
        (LEAVE_TYPES[leave.leaveType]?.toLowerCase().includes(term))
      );
    }
    return true; 
  });
  console.log("Filtered Approvals (after filter):", filteredApprovals);
  const sortedApprovals = [...filteredApprovals].sort((a, b) => {
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    if (isLeaveStartingSoon(a.startDate) && !isLeaveStartingSoon(b.startDate)) return -1;
    if (!isLeaveStartingSoon(a.startDate) && isLeaveStartingSoon(b.startDate)) return 1;
    return isBefore(a.startDate, b.startDate) ? -1 : 1;
  });
  
  const departments = Array.from(new Set(pendingApprovals.map(leave => leave.applicantDepartment)));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pending Approvals</h1>
        <p className="text-gray-600">
          Review and approve leave applications
        </p>
      </div>
      
      {/* Filters, Search, and Bulk Actions */}
      <div className="card mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
            <div className="mb-4 md:mb-0 flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Search by name or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="filterDepartment" className="form-label">Department</label>
                <select
                  id="filterDepartment"
                  className="form-select"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="filterType" className="form-label">Leave Type</label>
                <select
                  id="filterType"
                  className="form-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {Object.entries(LEAVE_TYPES).map(([type, label]) => (
                    <option key={type} value={type}>
                      {label} ({type})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={filterUrgent}
                    onChange={(e) => setFilterUrgent(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-gray-700">Urgent only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Bulk Actions Section */}
          {sortedApprovals.length > 0 && (
            <>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center bg-gray-50 p-2 rounded-md">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedLeaves.length === sortedApprovals.length && sortedApprovals.length > 0}
                        onChange={toggleSelectAll}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Select All Applications
                      </span>
                    </label>
                    {selectedLeaves.length > 0 && (
                      <button
                        onClick={clearSelection}
                        className="ml-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear Selection
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      {selectedLeaves.length} selected
                    </span>
                    <button
                      onClick={() => setShowBulkComment(true)}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                        selectedLeaves.length === 0
                          ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                          : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300'
                      }`}
                      disabled={selectedLeaves.length === 0}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject Selected
                    </button>
                    <button
                      onClick={() => setShowBulkComment(true)}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                        selectedLeaves.length === 0
                          ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                          : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300'
                      }`}
                      disabled={selectedLeaves.length === 0}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve Selected
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Comment Section (Collapsible) */}
              {showBulkComment && selectedLeaves.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-md shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <label className="form-label flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1 text-blue-600" />
                      Comment for Bulk Action
                    </label>
                    <button
                      onClick={() => setShowBulkComment(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add your comments for bulk approval/rejection..."
                  ></textarea>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={handleBulkReject}
                      className="btn-danger flex items-center px-4 py-2"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Confirm Reject
                    </button>
                    <button
                      onClick={handleBulkApprove}
                      className="btn-success flex items-center px-4 py-2"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Confirm Approve
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Approval List */}
      {sortedApprovals.length > 0 ? (
        <div className="space-y-4">
          {sortedApprovals.map((leave) => (
            <div 
              key={leave.id} 
              className={`card hover:shadow-md transition-shadow ${
                selectedLeaves.includes(leave.id) ? 'bg-blue-50' : 'bg-white'
              } ${
                leave.isUrgent ? 'border-l-4 border-red-500' : 
                isLeaveStartingSoon(leave.startDate) ? 'border-l-4 border-yellow-500' : ''
              }`}
            >
              {/* Header */}
              <div 
                className="flex justify-between items-start cursor-pointer"
                onClick={() => toggleExpand(leave.id)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                    checked={selectedLeaves.includes(leave.id)}
                    onChange={() => toggleSelectLeave(leave.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-gray-900">
                        {leave.applicantName}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {leave.applicantDepartment}
                      </span>
                      {leave.isUrgent && (
                        <span className="ml-2 badge-urgent flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium text-gray-700">
                        {LEAVE_TYPES[leave.leaveType]}
                      </span>
                      <span className="ml-2 badge bg-gray-100 text-gray-800">
                        {leave.leaveType}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {format(leave.startDate, 'MMM dd, yyyy')} - {format(leave.endDate, 'MMM dd, yyyy')}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {getLeaveDuration(leave.startDate, leave.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`badge ${getStatusBadgeClass(leave.status)}`}>
                    {leave.status === 'forwarded' ? 'Forwarded to you' : 
                     leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </span>
                  {expandedLeave === leave.id ? (
                    <ChevronUp className="ml-2 h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {/* Expanded details */}
              {expandedLeave === leave.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Reason for Leave</h4>
                      <p className="text-sm text-gray-600">{leave.reason}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Application Details</h4>
                      <p className="text-sm text-gray-600">
                        Applied on: {format(leave.createdAt, 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Last updated: {format(leave.updatedAt, 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  {(leave.alternateArrangements || leave.contactDuringLeave) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {leave.alternateArrangements && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">
                            Alternate Arrangements
                          </h4>
                          <p className="text-sm text-gray-600">{leave.alternateArrangements}</p>
                        </div>
                      )}
                      
                      {leave.contactDuringLeave && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">
                            Contact During Leave
                          </h4>
                          <p className="text-sm text-gray-600">{leave.contactDuringLeave}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Documents */}
                  {(leave.documents ?? []).length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800">Attached Documents</h4>
                      <ul className="list-disc ml-5 text-sm text-blue-600 mt-1">
                        {(leave.documents ?? []).map((doc, index) => (
                          <li key={index}>
                            <a
                              href={`http://localhost:5000/uploads/${doc}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {doc}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  
                  {/* Previous approvals */}
                  {leave.approvalChain.some(step => step.status === 'approved') && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Previous Approvals</h4>
                      <div className="space-y-2">
                        {leave.approvalChain
                          .filter(step => step.status === 'approved')
                          .map((step, index) => (
                            <div key={index} className="bg-green-50 p-3 rounded-md">
                              <div className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span className="font-medium capitalize">{step.role} Approval</span>
                                {step.timestamp && (
                                  <span className="ml-2 text-gray-500">
                                    on {format(step.timestamp, 'MMM dd, yyyy')}
                                  </span>
                                )}
                              </div>
                              {step.comment && (
                                <p className="text-sm text-gray-600 mt-1 ml-6">{step.comment}</p>
                              )}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  
                  {/* Add comment */}
                  <div className="mb-4">
                    <label htmlFor="comment" className="form-label flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Add Comment
                    </label>
                    <textarea
                      id="comment"
                      className="form-input"
                      rows={2}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add your comments or reason for approval/rejection..."
                    ></textarea>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleReject(leave.id)}
                      className="btn-danger flex items-center px-4 py-2"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(leave.id)}
                      className="btn-success flex items-center px-4 py-2"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card py-12">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No pending approvals</h3>
            <p className="text-gray-500">
              {filterDepartment !== 'all' || filterType !== 'all' || filterUrgent || searchTerm
                ? 'Try changing your filters to see more results'
                : 'You are all caught up!'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalDashboard;