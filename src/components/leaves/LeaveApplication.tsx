import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, Info, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LeaveType, LEAVE_TYPES, LEAVE_POLICIES } from '../../types/leave';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const LeaveApplication: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
const role = user?.role;
  const [leaveType, setLeaveType] = useState<LeaveType>('CL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [alternateArrangements, setAlternateArrangements] = useState<string>('');
  const [contactDuringLeave, setContactDuringLeave] = useState<string>('');
  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const selectedPolicy = LEAVE_POLICIES.find(policy => policy.leaveType === leaveType);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !reason) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      toast.error('End date cannot be before start date');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Leave application submitted successfully');
      navigate('/leave-status');
    } catch (error) {
      toast.error('Failed to submit leave application');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };
  
  
  // Filter available leave types based on user role
  const availableLeaveTypes = Object.entries(LEAVE_TYPES).filter(([type]) => {
    const policy = LEAVE_POLICIES.find((policy) => policy.leaveType === type);

    if (!policy) return false;

    // AHL should only be visible to 'adhoc' users
    if (type === 'AHL') return role === 'adhoc';

    // Other leave types should not be available for 'adhoc' users
    if (role === 'adhoc') return false;

    // Allow if the user's role matches eligibleRoles for the leave type
    return policy.eligibleRoles.includes(role || '');
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Apply for Leave</h1>
        <p className="text-gray-600">
          Submit a new leave application for approval
        </p>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Leave Type */}
            <div>
              <label htmlFor="leaveType" className="form-label">Leave Type</label>
              <select
                id="leaveType"
                className="form-select"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                required
              >
                {availableLeaveTypes.map(([type, label]) => (
                  <option key={type} value={type}>
                    {label} ({type})
                  </option>
                ))}
              </select>
              
              {selectedPolicy && (
                <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm text-blue-800 flex items-start">
                  <Info className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" />
                  <div>
                    <p className="font-medium">{selectedPolicy.description}</p>
                    <p className="mt-1">Maximum duration: {selectedPolicy.maxDuration} days</p>
                    {selectedPolicy.specialConditions && (
                      <p className="mt-1">Note: {selectedPolicy.specialConditions}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="form-label">Start Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="startDate"
                    type="date"
                    className="form-input pl-10"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="endDate" className="form-label">End Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="endDate"
                    type="date"
                    className="form-input pl-10"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || format(new Date(), 'yyyy-MM-dd')}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Reason */}
            <div>
              <label htmlFor="reason" className="form-label">Reason for Leave</label>
              <textarea
                id="reason"
                className="form-input"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide detailed reason for your leave request"
                required
              ></textarea>
            </div>
            
            {/* Urgent Leave */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="urgent"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="urgent" className="font-medium text-gray-700">
                  Mark as Urgent
                </label>
                <p className="text-gray-500">
                  Urgent leaves are prioritized for immediate review
                </p>
              </div>
            </div>
            
            {/* Alternate Arrangements */}
            <div>
              <label htmlFor="alternateArrangements" className="form-label">
                Alternate Arrangements During Leave
              </label>
              <textarea
                id="alternateArrangements"
                className="form-input"
                rows={2}
                value={alternateArrangements}
                onChange={(e) => setAlternateArrangements(e.target.value)}
                placeholder="Describe arrangements for your duties during absence (e.g., classes, labs, meetings)"
              ></textarea>
            </div>
            
            {/* Contact During Leave */}
            <div>
              <label htmlFor="contactDuringLeave" className="form-label">
                Contact Information During Leave
              </label>
              <input
                id="contactDuringLeave"
                type="text"
                className="form-input"
                value={contactDuringLeave}
                onChange={(e) => setContactDuringLeave(e.target.value)}
                placeholder="Phone number or email where you can be reached if needed"
              />
            </div>
            
            {/* Supporting Documents */}
            <div>
              <label htmlFor="documents" className="form-label">
                Supporting Documents
                {selectedPolicy?.documents && selectedPolicy.documents.length > 0 && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <input
                id="documents"
                type="file"
                className="form-input"
                onChange={handleFileChange}
                multiple
                required={selectedPolicy?.documents && selectedPolicy.documents.length > 0}
              />
              
              {selectedPolicy?.documents && selectedPolicy.documents.length > 0 && (
                <div className="mt-2 p-3 bg-yellow-50 rounded-md text-sm text-yellow-800 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-yellow-500" />
                  <div>
                    <p className="font-medium">Required documents:</p>
                    <ul className="list-disc list-inside mt-1">
                      {selectedPolicy.documents.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {documents.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Selected files:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {documents.map((file, index) => (
                      <li key={index} className="flex items-center">
                        <FileText className="h-4 w-4 mr-1 text-gray-400" />
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Approval Flow */}
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Approval Flow</h3>
              <div className="flex items-center">
                {/* <div className="flex-1 text-center">
                  <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                    1
                  </div>
                  <p className="text-xs mt-1">You</p>
                </div>
                <div className="w-full max-w-[50px] h-0.5 bg-gray-300"></div> */}
                <div className="flex-1 text-center">
                  <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mx-auto">
                    1
                  </div>
                  <p className="text-xs mt-1">HOD</p>
                </div>
                {(role !== 'adhoc') && (
                  <>
                    <div className="w-full max-w-[50px] h-0.5 bg-gray-300"></div>
                    <div className="flex-1 text-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mx-auto">
                        2
                      </div>
                      <p className="text-xs mt-1">Dean FA</p>
                    </div>
                  </>
                 )}
                {(leaveType === 'SPCL' || leaveType === 'ML' || leaveType === 'PL' || 
                  leaveType === 'CCL' || leaveType === 'OD' || role === 'dean') && (
                  <>
                    <div className="w-full max-w-[50px] h-0.5 bg-gray-300"></div>
                    <div className="flex-1 text-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mx-auto">
                        3
                      </div>
                      <p className="text-xs mt-1">Director</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="btn-outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplication;