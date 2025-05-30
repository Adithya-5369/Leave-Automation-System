import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileSearch
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LeaveApplication, LeaveApplicationRaw, LEAVE_TYPES, LeaveType } from '../../types/leave';
import { format, differenceInDays } from 'date-fns';
import { fetchUserLeaves } from '../../api';

/*// Mock data
const mockLeaveApplications: LeaveApplication[] = [
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
      { role: 'hod', status: 'approved', timestamp: new Date(2025, 3, 6), comment: 'Approved' },
      { role: 'dean', status: 'approved', timestamp: new Date(2025, 3, 6), comment: 'Approved' }
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
    reason: 'Conference attendance at IIT Bombay',
    isUrgent: false,
    status: 'pending',
    createdAt: new Date(2025, 4, 1),
    updatedAt: new Date(2025, 4, 1),
    approvalChain: [
      { role: 'hod', status: 'approved', timestamp: new Date(2025, 4, 2), comment: 'Approved' },
      { role: 'dean', status: 'pending' },
      { role: 'director', status: 'pending' }
    ],
    currentApprover: 'dean',
    alternateArrangements: 'Classes will be handled by PhD scholars',
    contactDuringLeave: '+91 9876543210'
  },
];*/

  const LeaveStatus: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [expandedLeave, setExpandedLeave] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        if (!user?.id) {
          console.error('No user ID available');
          return;
        }
        console.log('Fetching leaves for user:', user.id);
        const data = await fetchUserLeaves(user.id);
        console.log('Fetched Leaves Data:', data);
  
        const parsed: LeaveApplication[] = data.map((leave: LeaveApplicationRaw) => ({
          id: leave.id.toString(),
          applicantId: leave.applicant_id.toString(),
          applicantName: leave.applicant_name ?? 'Unknown',
          applicantDepartment: leave.applicant_department ?? 'Unknown',
          leaveType: leave.leave_type as LeaveType,
          startDate: new Date(leave.start_date),
          endDate: new Date(leave.end_date),
          reason: leave.reason,
          isUrgent: leave.is_urgent,
          status: leave.status,
          createdAt: new Date(leave.created_at),
          updatedAt: new Date(leave.updated_at),
          approvalChain: Array.isArray(leave.approval_chain)
            ? leave.approval_chain.map(step => ({
                ...step,
                timestamp: step.timestamp ? new Date(step.timestamp) : undefined,
              }))
            : JSON.parse(leave.approval_chain).map((step: { role: string; status: string; timestamp?: string; comment?: string }) => ({
                ...step,
                timestamp: step.timestamp ? new Date(step.timestamp) : undefined,
              })),
          currentApprover: leave.current_approver,
          alternateArrangements: leave.alternate_arrangements,
          documents: leave.documents ?? [],
          contactDuringLeave: leave.contact_during_leave,
        }));
        parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLeaveApplications(parsed);

      } catch (error) {
        console.error('Error fetching leaves:', error);
      }
    };
  
    fetchLeaves();
  }, [user]);
  
  const toggleExpand = (id: string) => {
    if (expandedLeave === id) {
      setExpandedLeave(null);
    } else {
      setExpandedLeave(id);
    }
  };
  
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

  const filteredLeaves = leaveApplications.filter(leave => {
    // Apply status filter
    if (filterStatus !== 'all' && leave.status !== filterStatus) return false;
  
    // Apply type filter
    if (filterType !== 'all' && leave.leaveType !== filterType) return false;
  
    return true;
  });
  
  console.log("Parsed leaves after filter:", filteredLeaves);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leave Applications</h1>
          <p className="text-gray-600">
            Track the status of your leave applications
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate('/leave-application')}
            className="btn-primary"
          >
            New Application
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="mb-4 md:mb-0">
            <label htmlFor="filterStatus" className="form-label">Status</label>
            <select
              id="filterStatus"
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
              {Object.entries(LEAVE_TYPES)
                .filter(([type]) => {
                  if (user?.role === 'adhoc') {
                    return type === 'AHL'; // Show only AHL for adhoc users
                  } else {
                    return type !== 'AHL'; // Exclude AHL for non-adhoc users
                  }
                })
                .map(([type, label]) => (
                  <option key={type} value={type}>
                    {label} ({type})
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Leave Applications */}
      {filteredLeaves.length > 0 ? (
        <div className="space-y-4">
          {filteredLeaves.map((leave) => (
            <div key={leave.id} className="card hover:shadow-md transition-shadow">
              {/* Header */}
              <div 
                className="flex justify-between items-start cursor-pointer"
                onClick={() => toggleExpand(leave.id)}
              >
                <div>
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-900">
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
                </div>
                <div className="flex items-center">
                  <span className={`badge ${getStatusBadgeClass(leave.status)}`}>
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
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
                  
                  {/* Approval chain */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Approval Status</h4>
                    <div className="flex items-center justify-center">
                      {leave.approvalChain
                        .map((step) => ({
                          ...step,
                          status: step.status?.toLowerCase().trim(),
                        }))
                        .map((step, index, arr) => {
                          const isLast = index === arr.length - 1;
                          const nextStep = arr[index + 1];

                          return (
                            <React.Fragment key={index}>
                              {/* Step Circle */}
                              <div className="flex flex-col items-center text-center">
                                <div
                                  className={`h-8 w-8 rounded-full flex items-center justify-center
                                  ${step.status === 'approve'
                                    ? 'bg-green-100 text-green-600'
                                    : step.status === 'reject'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-yellow-100 text-yellow-600'
                                  }`}
                                >
                                  {step.status === 'approve' && <CheckCircle className="h-5 w-5" />}
                                  {step.status === 'reject' && <XCircle className="h-5 w-5" />}
                                  {step.status === 'pending' && <Clock className="h-5 w-5" />}
                                </div>
                                <p className="text-xs mt-1 capitalize">{step.role}</p>
                                {step.timestamp && (
                                  <p className="text-xs text-gray-500">{format(new Date(step.timestamp), 'MMM dd')}</p>
                                )}
                              </div>

                              {/* Connector to next */}
                              {!isLast && (
                                <div
                                  className={`w-10 h-0.5 mx-2 
                                  ${step.status === 'approve' && nextStep?.status !== 'reject'
                                    ? 'bg-green-500'
                                    : step.status === 'reject'
                                    ? 'bg-red-500'
                                    : 'bg-gray-300'
                                  }`}
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                    </div>
                  </div>
                 
                  {/* Comments */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Comments</h4>
                    {leave.approvalChain.some(step => step.comment) ? (
                      <div className="space-y-2">
                        {leave.approvalChain
                          .filter(step => step.comment)
                          .map((step, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center text-sm">
                                <span className="font-medium capitalize">{step.role}:</span>
                                <span className="ml-2 text-gray-600">{step.comment}</span>
                              </div>
                              {step.timestamp && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {format(step.timestamp, 'MMM dd, yyyy')}
                                </div>
                              )}
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No comments provided</p>
                    )}
                  </div>

                  {/* Documents Section */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h4>
                      {leave.documents && leave.documents.length > 0 && (
                      <ul className="space-y-1 text-sm">
                        {leave.documents.map((file, index) => (
                          <li key={index}>
                            <a
                              href={`http://localhost:5000/uploads/${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              {file}
                            </a>
                          </li>
                        ))}
                      </ul>
                      )}
                    </div>

                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card py-12">
          <div className="text-center">
            <FileSearch className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No leave applications found</h3>
            <p className="text-gray-500">
              {filterStatus !== 'all' || filterType !== 'all'
                ? 'Try changing your filters to see more results'
                : 'Apply for a new leave to get started'}
            </p>
            <button
              onClick={() => navigate('/leave-application')}
              className="btn-primary mt-4"
            >
              Apply for Leave
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveStatus;