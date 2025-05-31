import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { fetchLeaveUsageByMonth } from '../../api';
import { useAuth } from '../../context/AuthContext';

const colors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#6366F1', '#14B8A6', '#A855F7', '#D97706'
];

interface MonthlyUsage {
    month: string; // e.g., "Jan"
    [leaveType: string]: string | number; // dynamic keys for leave types (e.g., "CL", "EL")
}
  

const LeaveUsageChart = () => {
    const [data, setData] = useState<MonthlyUsage[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<string[]>([]);
    const user = useAuth().user;

  useEffect(() => {
    const load = async () => {
      try {
        const userId = user?.id;
        if (!userId) return;
  
        const usage = await fetchLeaveUsageByMonth(userId);
        setData(usage);

        const types = new Set<string>();
        usage.forEach((month: MonthlyUsage) => {
          Object.keys(month).forEach(k => {
            if (k !== 'month') types.add(k);
          });
        });
        setLeaveTypes(Array.from(types));
      } catch (err) {
        console.error('Error loading usage chart:', err);
      }
    };
    load();
  }, [user]);

  return (
      <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {leaveTypes.map((type, i) => (
              <Bar
              key={type}
              dataKey={type}
              stackId="a"
              fill={colors[i % colors.length]}
              name={`${type} Leave`}
              radius={[4, 4, 0, 0]}
              />
          ))}
          </BarChart>
      </ResponsiveContainer>
  );
};

export default LeaveUsageChart;
