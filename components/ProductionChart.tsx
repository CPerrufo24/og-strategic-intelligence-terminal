
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { ProductionData } from '../types';
import { COLORS } from '../constants';

interface ProductionChartProps {
  data: ProductionData[];
}

const ProductionChart: React.FC<ProductionChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#666' }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#666' }}
            domain={[0, 2.0]}
          />
          <Tooltip 
            cursor={{ fill: '#f5f5f5' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
          <Bar name="Actual (M bpd)" dataKey="actual" fill={COLORS.NAVY} radius={[4, 4, 0, 0]} barSize={20} />
          <ReferenceLine y={1.8} label={{ position: 'right', value: 'Meta: 1.8', fill: COLORS.DANGER, fontSize: 10 }} stroke={COLORS.DANGER} strokeDasharray="3 3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductionChart;
