import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export type UserRole = 'adhoc' | 'faculty' | 'hod' | 'odean' | 'dean' | 'registrar' | 'director' | 'admin';
export type EmployeeType = 'regular' | 'adhoc' | 'outsourced';
export type EmployeeCategory = 'teaching' | 'non-teaching';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  employeeType: EmployeeType;
  employeeCategory: EmployeeCategory;
  level: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyOtp: (otp: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Faculty',
    email: 'faculty@nitandhra.ac.in',
    password: 'password',
    role: 'faculty' as UserRole,
    department: 'Computer Science',
    employeeType: 'regular' as EmployeeType,
    employeeCategory: 'teaching' as EmployeeCategory,
  },
  {
    id: '2',
    name: 'HoD CSE',
    email: 'hod@nitandhra.ac.in',
    password: 'password',
    role: 'hod' as UserRole,
    department: 'Computer Science',
    employeeType: 'regular' as EmployeeType,
    employeeCategory: 'teaching' as EmployeeCategory,
  },
  {
    id: '3',
    name: 'Dean FA',
    email: 'dean@nitandhra.ac.in',
    password: 'password',
    role: 'dean' as UserRole,
    department: 'Faculty Affairs',
    employeeType: 'regular' as EmployeeType,
    employeeCategory: 'teaching' as EmployeeCategory,
  },
  {
    id: '4',
    name: 'Registrar',
    email: 'registrar@nitandhra.ac.in',
    password: 'password',
    role: 'registrar' as UserRole,
    employeeType: 'regular' as EmployeeType,
    employeeCategory: 'teaching' as EmployeeCategory,
    level: 12,
  },
  {
    id: '5',
    name: 'Director',
    email: 'director@nitandhra.ac.in',
    password: 'password',
    role: 'director' as UserRole,
    employeeType: 'regular' as EmployeeType,
    employeeCategory: 'teaching' as EmployeeCategory,
  },
  {
    id: '6',
    name: 'Adhoc',
    email: 'adhoc@nitandhra.ac.in',
    password: 'password',
    role: 'adhoc' as UserRole,
    department: 'Computer Science',
    employeeType: 'adhoc' as EmployeeType,
    employeeCategory: 'teaching' as EmployeeCategory,
  },
  {
    id: '7',
    name: 'Admin',
    email: 'admin@nitandhra.ac.in',
    password: 'password',
    role: 'admin' as UserRole,
    employeeType: 'regular' as EmployeeType,
    employeeCategory: 'non-teaching' as EmployeeCategory,
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate(); // import this from react-router-dom
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tempUser, setTempUser] = useState<any>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);

  /* useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);

    // Clear localStorage on window close or refresh
    const handleUnload = () => localStorage.removeItem('user');

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []); */

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const isLoginPage = window.location.pathname === '/login';
  
    // ✅ Restore user
    try {
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email && parsedUser.role) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user');
        }
      }
    } catch {
      localStorage.removeItem('user');
    }
  
    setIsLoading(false);
  
      // ✅ Show confirmation popup on refresh/tab close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isLoginPage && storedUser) {
        const confirmationMessage = "You are about to be logged out. Are you sure you want to leave?";
        e.preventDefault();
        e.returnValue = confirmationMessage; // 👈 Required for Chrome
        return confirmationMessage;          // 👈 Required for some other browsers
      }
    };

    // ✅ Logout silently on actual unload (tab close or refresh)
    const handleUnload = () => {
      if (!isLoginPage && storedUser) {
        localStorage.removeItem('user'); // Clear user
        sessionStorage.clear(); // 🔒 Clear session data if needed
      }
    };
  
    // ✅ Logout on back navigation and prevent forward access
    const handlePopState = () => {
      const path = window.location.pathname;
      const isProtected = path !== '/login';
  
      if (isProtected && localStorage.getItem('user')) {
        // 🔐 User trying to go back from a protected route → logout
        logout();
  
        // ⛔ Prevent forward from bringing user back
        window.history.pushState({}, '', '/login');
      }
    };
  
    // ✅ Clear forward history on logout (call inside your `logout()` function too!)
    const preventForwardLogin = () => {
      window.history.pushState({}, '', '/login');
      window.history.forward = () => {};
    };
  
      // Add listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      // Cleanup listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  
  

  /* const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching credentials
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Store user temporarily until OTP verification
      setTempUser(foundUser);
      setOtpSent(true);
      
      // Simulate sending OTP
      toast.success(`OTP sent to ${email}. For demo, use "123456"`);
      
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit OTP
      if (otp !== '123456') {
        throw new Error('Invalid OTP');
      }
      
      // Set authenticated user
      const authenticatedUser = {
        ...tempUser,
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      setOtpSent(false);
      setTempUser(null);
      
      toast.success('Login successful');
      return true;
      
    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }; */

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
  
      // ✅ Send OTP here
      const otpResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      const otpData = await otpResponse.json();
      if (!otpResponse.ok) throw new Error(otpData.message || 'OTP sending failed');
  
      setTempUser({ email });
      setOtpSent(true);
      toast.success('OTP sent to your email');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Login failed';
      toast.error(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyOtp = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tempUser?.email, otp }),
      });
  
      const data = await response.json();
      console.log('OTP response data:', data);
  
      if (!response.ok) throw new Error(data.message || 'Invalid OTP');
  
      // TEMP PATCH: Create a fake user using tempUser if backend doesn’t return it
      const authenticatedUser = {
        ...tempUser,
        name: 'User', // fallback values
        role: 'faculty',
        employeeType: 'regular',
        employeeCategory: 'teaching',
        ...data.user, // override with backend data if present
      };
  
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      setOtpSent(false);
      setTempUser(null);
      toast.success(data.message || 'OTP verified successfully');
  
      const role = authenticatedUser.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'hod' || role === 'dean') navigate('/approvals');
      else navigate('/dashboard');
  
      return true;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'OTP verification failed';
      toast.error(errMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (email: string, newPassword: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
  
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Reset failed');
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');

    // 🔁 Navigate to login and clear history so forward won't return to previous page
    navigate('/login', { replace: true });
  };
  
  

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        verifyOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};