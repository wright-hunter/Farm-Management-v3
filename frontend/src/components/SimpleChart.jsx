import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import styles from './simplechart.module.css';

const SimpleChart = ({ data, dataKey, xAxisKey, title }) => {
  // Simple data sorting by year if needed
  const chartData = data ? [...data].sort((a, b) => {
    if (a[xAxisKey] && b[xAxisKey]) {
      return a[xAxisKey] - b[xAxisKey];
    }
    return 0;
  }) : [];

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title} Over Time</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke= "black" 
              activeDot={{ r: 8 }} 
              name={title}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimpleChart;