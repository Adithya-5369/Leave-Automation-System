import React, { useState, useEffect } from 'react';
import { Bell, LogOut, CheckCircle, Clock, Menu, AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../types/leave';
import { formatDistanceToNow } from 'date-fns';
//import { isAdhoc } from '../../utils/roleHelpers';
import { markNotificationAsRead } from '../../api';

interface HeaderProps {
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ setShowSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);


  /*// Load read notifications from localStorage
  useEffect(() => {
    const storedRead = localStorage.getItem('readNotifications');
    if (storedRead) {
      setReadNotifications(JSON.parse(storedRead));
    }
  }, []);

  // Role-based notifications
  useEffect(() => {
    if (!user) return;

    const roleBasedNotifications: Notification[] = [];

    // For adhoc users
    if (isAdhoc(user.role)) {
      roleBasedNotifications.push(
        {
          id: '1',
          type: 'status',
          message: 'Your AHL application has been approved',
          timestamp: new Date(),
          read: readNotifications.includes('1'),
          link: '/leave-status'
        },
        {
          id: '2',
          type: 'status',
          message: 'Your AHL application is pending approval',
          timestamp: new Date(Date.now() - 3600000),
          read: readNotifications.includes('2'),
          link: '/leave-status'
        }
      );
    }

    // For HODs
    if (user.role === 'hod') {
      roleBasedNotifications.push(
        {
          id: '3',
          type: 'approval',
          message: 'New leave application from Faculty 1 needs your approval',
          timestamp: new Date(),
          read: readNotifications.includes('3'),
          link: '/approvals'
        },
        {
          id: '4',
          type: 'approval',
          message: 'New leave application from Adhoc Faculty needs your approval',
          timestamp: new Date(Date.now() - 7200000),
          read: readNotifications.includes('4'),
          link: '/approvals'
        }
      );
    }

    // For Deans
    if (user.role === 'dean') {
      roleBasedNotifications.push(
        {
          id: '5',
          type: 'approval',
          message: 'New leave application from HOD needs your approval',
          timestamp: new Date(),
          read: readNotifications.includes('5'),
          link: '/approvals'
        }
      );
    }

    // For Registrars
    if (user.role === 'registrar') {
      roleBasedNotifications.push(
        {
          id: '6',
          type: 'approval',
          message: 'New leave application from Dean needs your approval',
          timestamp: new Date(),
          read: readNotifications.includes('6'),
          link: '/approvals'
        }
      );
    }

    // For Directors
    if (user.role === 'director') {
      roleBasedNotifications.push(
        {
          id: '7',
          type: 'approval',
          message: 'New leave application from Registrar needs your approval',
          timestamp: new Date(),
          read: readNotifications.includes('7'),
          link: '/approvals'
        }
      );
    }

    // For regular faculty
    if (user.role === 'faculty') {
      roleBasedNotifications.push(
        {
          id: '8',
          type: 'status',
          message: 'Your CL application has been approved',
          timestamp: new Date(),
          read: readNotifications.includes('8'),
          link: '/leave-status'
        },
        {
          id: '9',
          type: 'status',
          message: 'Your EL application is pending approval',
          timestamp: new Date(Date.now() - 3600000),
          read: readNotifications.includes('9'),
          link: '/leave-status'
        }
      );
    }

    setNotifications(roleBasedNotifications);
    setUnreadCount(roleBasedNotifications.filter(n => !n.read).length);
  }, [user, readNotifications]);*/

  useEffect(() => {
    if (!user?.id) return;
  
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/${user.id}`);
        const data = await res.json();
        const parsed = data.map((n: { id: number; user_id: number; is_read: boolean; created_at: string; [key: string]: unknown }) => ({
          ...n,
          id: n.id.toString(),
          user_id: n.user_id.toString(),
          read: n.is_read,
          timestamp: new Date(n.created_at),
        }));
      
        setNotifications(parsed);
        setUnreadCount(parsed.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
  
    fetchNotifications();
  }, [user]);
  
  

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.read) {
        await markNotificationAsRead(Number(notification.id));
        setNotifications((prev) =>
          prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
      // Redirect based on message keywords or roles
      switch (notification.type) {
        case 'approval':
          navigate('/approvals');
          break;
        case 'status':
          navigate('/leave-status');
          break;
        default:
          navigate('/'); // fallback
      }
    } catch (error) {
      console.error('Failed to mark notification as read or navigate:', error);
      }
  };

  const markAllAsRead = async () => {
    try {
      for (const notification of notifications.filter(n => !n.read)) {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/${notification.id}/read`, {
          method: 'PUT',
        });
      }
  
      // Refresh notifications
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/${user?.id}`);
      const updated = await res.json();
      setNotifications(updated);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };
  

  const notificationIcons: Record<string, JSX.Element> = {
    approval: <CheckCircle className="h-4 w-4 text-blue-500" />,
    status: <Clock className="h-4 w-4 text-orange-500" />,
    reminder: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    system: <Info className="h-4 w-4 text-gray-600" />,
  };
    
  const getNotificationIcon = (type: string): JSX.Element => {
    return notificationIcons[type] || <Bell className="h-4 w-4 text-gray-500" />;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 lg:hidden"
            onClick={(e) => {
              e.stopPropagation(); // prevent bubbling
              setShowSidebar(prev => !prev); // <-- you should define this state
            }}
            
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-semibold text-gray-800">
              Faculty Leave Automation
            </h1>
            <p className="text-sm text-gray-500">NIT Andhra Pradesh</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-orange-600 hover:text-orange-700"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-orange-50' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {formatDistanceToNow(notification.created_at, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                {user?.name.charAt(0)}
              </div>
              <span className="hidden md:inline-block font-medium text-gray-700">
                {user?.name}
              </span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-500 capitalize mt-1">
                    {user?.role} • {user?.department}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;