import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Calendar, 
  FileText, 
  Search,
  Filter,
  UserPlus,
  Trash2,
  Edit,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LEAVE_TYPES } from '../../types/leave';

// Mock data for departments
const mockDepartments = [
  { id: '1', name: 'Computer Science', facultyCount: 25, hodName: 'Dr. Nagesh Bhattu Sristy' },
  { id: '2', name: 'Electrical Engineering', facultyCount: 22, hodName: 'Dr. Tejavathu Ramesh' },
  { id: '3', name: 'Mechanical Engineering', facultyCount: 20, hodName: 'Dr. Santhosh Kumar' },
  { id: '4', name: 'Civil Engineering', facultyCount: 18, hodName: 'Dr. Talari Reshma' },
  { id: '5', name: 'Electronics & Communication', facultyCount: 24, hodName: 'Dr. Narasimha Rao Banavathu' },
  { id: '6', name: 'Chemical Engineering', facultyCount: 15, hodName: 'Dr. Vinoth Kumar Raja' },
  { id: '7', name: 'Biotechnology', facultyCount: 12, hodName: 'Dr. Sudarshana Deepa V' },
  { id: '8', name: 'Metallurgical & Materials', facultyCount: 10, hodName: 'Dr. Raffi Mohammed' },
  { id: '9', name: 'Chemistry', facultyCount: 8, hodName: 'Dr. Amarendra Reddy M' },
  { id: '10', name: 'Mathematics', facultyCount: 9, hodName: 'Dr. Sharad Dwivedi' }
];

// Mock data for leave statistics
const mockLeaveStats = {
  totalLeavesTaken: 245,
  pendingApprovals: 18,
  approvedLeaves: 210,
  rejectedLeaves: 17,
  leavesByType: [
    { type: 'CL', count: 120 },
    { type: 'EL', count: 45 },
    { type: 'SPCL', count: 35 },
    { type: 'OD', count: 25 },
    { type: 'ML', count: 10 },
    { type: 'PL', count: 5 },
    { type: 'Others', count: 5 }
  ],
  leavesByDepartment: [
    { department: 'Computer Science', count: 45 },
    { department: 'Electrical Engineering', count: 38 },
    { department: 'Mechanical Engineering', count: 32 },
    { department: 'Civil Engineering', count: 28 },
    { department: 'Electronics & Communication', count: 42 },
    { department: 'Others', count: 60 }
  ]
};

// Mock data for recent activities
const mockRecentActivities = [
  { id: '1', action: 'New faculty added', department: 'Computer Science', user: 'Dr. Kiran Kumar', timestamp: new Date(2025, 4, 25, 10, 30) },
  { id: '2', action: 'Department updated', department: 'Electrical Engineering', user: 'Admin', timestamp: new Date(2025, 4, 24, 14, 15) },
  { id: '3', action: 'Leave policy updated', department: 'All', user: 'Admin', timestamp: new Date(2025, 4, 23, 9, 45) },
  { id: '4', action: 'New HOD assigned', department: 'Physics', user: 'Dr. Name', timestamp: new Date(2025, 4, 22, 11, 20) },
  { id: '5', action: 'Faculty removed', department: 'Chemistry', user: 'Dr. Name', timestamp: new Date(2025, 4, 21, 16, 10) }
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [departments, setDepartments] = useState(mockDepartments);
  const [leaveStats, setLeaveStats] = useState(mockLeaveStats);
  const [recentActivities, setRecentActivities] = useState(mockRecentActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setDepartments(mockDepartments);
      setLeaveStats(mockLeaveStats);
      setRecentActivities(mockRecentActivities);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.hodName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage departments, faculty, and leave policies
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-5 w-5 inline-block mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'departments'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-5 w-5 inline-block mr-2" />
            Departments
          </button>
          <button
            onClick={() => setActiveTab('leave-policies')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'leave-policies'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="h-5 w-5 inline-block mr-2" />
            Leave Policies
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="h-5 w-5 inline-block mr-2" />
            Settings
          </button>
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card">
              <div className="flex items-center">
                <div className="rounded-full bg-orange-100 p-3 mr-4">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Leaves</p>
                  <h3 className="text-2xl font-bold text-gray-800">{leaveStats.totalLeavesTaken}</h3>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-100 p-3 mr-4">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Approvals</p>
                  <h3 className="text-2xl font-bold text-gray-800">{leaveStats.pendingApprovals}</h3>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Departments</p>
                  <h3 className="text-2xl font-bold text-gray-800">{departments.length}</h3>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Faculty Members</p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {departments.reduce((sum, dept) => sum + dept.facultyCount, 0)}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          
          {/* Leave Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave Distribution by Type</h3>
              <div className="space-y-4">
                {leaveStats.leavesByType.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {LEAVE_TYPES[item.type as keyof typeof LEAVE_TYPES] || item.type}
                      </span>
                      <span className="text-sm text-gray-500">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${(item.count / leaveStats.totalLeavesTaken) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave Distribution by Department</h3>
              <div className="space-y-4">
                {leaveStats.leavesByDepartment.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.department}</span>
                      <span className="text-sm text-gray-500">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(item.count / leaveStats.totalLeavesTaken) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Recent Activities */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
              <button 
                onClick={handleRefreshData}
                className="text-gray-500 hover:text-gray-700"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.timestamp.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">Departments</h3>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-primary flex items-center justify-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Add Department
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HOD
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faculty Count
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <tr key={dept.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dept.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dept.hodName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dept.facultyCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Policies Tab */}
      {activeTab === 'leave-policies' && (
        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">Leave Policies</h3>
            <div className="flex space-x-4">
              <button className="btn-outline flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Import
              </button>
              <button className="btn-outline flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
              <button className="btn-primary flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Add Policy
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eligible Roles
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(LEAVE_TYPES).map(([type, label], index) => (
                  <tr key={type}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{label}</div>
                      <div className="text-xs text-gray-500">{type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index % 2 === 0 ? 'For short absences due to personal reasons' : 'For official work outside the institute'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index % 3 === 0 ? '8 days' : index % 3 === 1 ? '15 days' : '30 days'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index % 4 === 0 ? 'All Faculty' : index % 4 === 1 ? 'Regular Faculty' : index % 4 === 2 ? 'Teaching Staff' : 'All Staff'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">System Settings</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Email Notifications</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Leave Application Notifications</p>
                    <p className="text-xs text-gray-500">Send email when a new leave application is submitted</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Approval Notifications</p>
                    <p className="text-xs text-gray-500">Send email when a leave is approved or rejected</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Reminder Notifications</p>
                    <p className="text-xs text-gray-500">Send reminders for pending approvals</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-700 mb-4">System Backup</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Automatic Backup</p>
                  <p className="text-xs text-gray-500 mb-2">Configure automatic backup schedule</p>
                  <select className="form-select">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Never</option>
                  </select>
                </div>
                
                <div>
                  <button className="btn-outline">
                    Manual Backup Now
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-700 mb-4">Academic Year Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Academic Year Start</label>
                  <input type="date" className="form-input" defaultValue="2025-07-01" />
                </div>
                <div>
                  <label className="form-label">Academic Year End</label>
                  <input type="date" className="form-input" defaultValue="2026-06-30" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-6">
              <button className="btn-outline">
                Cancel
              </button>
              <button className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;