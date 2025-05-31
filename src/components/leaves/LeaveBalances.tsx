import { useEffect, useState } from 'react';
import { fetchLeaveBalances } from '../../api';
import { useAuth } from '../../context/AuthContext';

interface LeaveBalance {
  type: string;
  name: string;
  total: number;
  used: number;
  remaining: number;
}

const LeaveBalances = () => {
  const { user } = useAuth();
  const [balances, setBalances] = useState<LeaveBalance[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const data = await fetchLeaveBalances(user.id);
        setBalances(data);
      } catch (err) {
        console.error('Failed to load leave balances:', err);
      }
    };
    load();
  }, [user]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Leave Balances</h2>
        <div className="text-sm text-gray-500">Academic Year 2025–26</div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4" style={{ minWidth: 'max-content' }}>
          {balances.map((balance) => {
            const usedPercentage = balance.total === 0 ? 0 : (balance.used / balance.total) * 100;
            return (
              <div key={balance.type} className="flex-shrink-0 w-56">
                <div className="bg-white rounded-lg shadow p-4 h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{balance.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {balance.type}
                    </span>
                  </div>
                  <div className="flex items-baseline mb-2">
                    <span className="text-2xl font-bold text-gray-900">{balance.remaining}</span>
                    <span className="ml-2 text-sm text-gray-500">/ {balance.total} days</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Used: {balance.used} days</span>
                      <span>{Math.round(usedPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1">
                      <div
                        className="bg-orange-500 h-1 rounded-full"
                        style={{ width: `${usedPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeaveBalances;