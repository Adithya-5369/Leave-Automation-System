import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

export type UserRole = 'adhoc' | 'faculty' | 'hod' | 'dean' | 'registrar' | 'director' | 'admin';
export type EmployeeType = 'regular' | 'adhoc' | 'outsourced';
export type EmployeeCategory = 'teaching' | 'non-teaching';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  employeeType: EmployeeType;
  employeeCategory: EmployeeCategory;
  level?: number;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tempUser, setTempUser] = useState<any>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);

  useEffect(() => {
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
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
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
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
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