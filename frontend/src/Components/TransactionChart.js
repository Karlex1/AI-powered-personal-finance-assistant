import React, { useEffect,useRef } from 'react'
import { Chart } from 'chart.js/auto';

const TransactionChart = ({ transactions }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
            if (transactions.length > 0) {
                const ctx = chartRef.current.getContext("2d");
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }
                const categories = transactions.map((t) => t.category);
                const amounts = transactions.map((t) => t.amount);
    
                chartInstance.current=new Chart(ctx, {
                    type: "doughnut",
                    data: {
                        labels: categories,
                        datasets: [
                            {
                                label: "Transactions",
                                data: amounts,
                                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                      maintainAspectRatio:false,  
                    },
                });
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        }
        }, [transactions]);
  return (
      <div >
          <h3>Transaction Chart</h3>
          <canvas id="transactionChart" ref={chartRef}></canvas>
      </div>
  )
}

export default TransactionChart;