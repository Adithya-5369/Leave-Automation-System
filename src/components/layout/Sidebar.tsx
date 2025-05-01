import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  FileText, 
  ClipboardCheck, 
  CheckSquare, 
  Users, 
  Settings,
  School
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['adhoc', 'faculty', 'hod', 'dean', 'registrar', 'director', 'admin'] },
    { name: 'Apply for Leave', href: '/leave-application', icon: FileText, roles: ['adhoc', 'faculty', 'hod', 'dean', 'registrar'] },
    { name: 'Leave Status', href: '/leave-status', icon: ClipboardCheck, roles: ['adhoc', 'faculty', 'hod', 'dean', 'registrar', 'director'] },
    { name: 'Approvals', href: '/approvals', icon: CheckSquare, roles: ['hod', 'dean', 'registrar', 'director'] },
    { name: 'Administration', href: '/admin', icon: Users, roles: ['admin'] },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center">
            <div class="logo-container"> <img src="images/logo.png" class="logo2" /> </div>
              <span className="ml-2 text-lg font-semibold text-gray-800">NIT Andhra</span>
            </div>
            <button
              type="button"
              className="lg:hidden text-gray-500 hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* User info */}
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation
              .filter(item => user && item.roles.includes(user.role))
              .map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
          </nav>
          
          {/* Footer */}
          {/* <div className="p-4 border-t border-gray-200">
            <NavLink
              to="/settings"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </NavLink>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;