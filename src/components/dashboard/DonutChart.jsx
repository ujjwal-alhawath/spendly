import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../ui/Skeleton';

export function DonutChart({ data }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Skeleton className="h-64 w-full" />;

  if (!data || data.length === 0) {
    return (
      <div className="h-64 mt-4 w-full flex items-center justify-center flex-col text-muted border border-dashed border-border rounded-xl">
        <span className="text-2xl mb-2">🍩</span>
        <p>No expense data for this month</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border p-5 rounded-xl h-[340px] flex flex-col">
      <h3 className="text-base font-semibold mb-4">Spending by Category</h3>
      <div className="flex-1 flex w-full h-full min-h-0">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `₹${value}`}
                contentStyle={{ backgroundColor: '#16161E', borderColor: 'rgba(255,255,255,0.07)', borderRadius: '8px' }}
                itemStyle={{ color: '#F1F1F3' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/3 flex flex-col justify-center gap-2 text-sm overflow-y-auto pr-2">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
              <span className="text-muted flex-1 truncate">{d.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
