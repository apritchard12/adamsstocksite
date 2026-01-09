'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const StockChart = ({ data, color = '#3b82f6' }) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            minTickGap={30}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'monospace' }}
            tickFormatter={(val) => val.toFixed(2)}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f3f4f6' }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#9ca3af' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
