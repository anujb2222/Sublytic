import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    {
      label: 'Expenses',
      data: [120, 150, 100, 200],
      backgroundColor: 'rgba(75,192,192,0.6)',
    },
  ],
};

function ExpenseChart() {
  return (
    <div className="expense-chart">
      <h2>Expense Forecast</h2>
      <Bar data={data} />
    </div>
  );
}

export default ExpenseChart;
