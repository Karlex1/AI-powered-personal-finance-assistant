import React, { useEffect } from 'react'
import { Chart } from 'chart.js/auto';

const TransactionChart = ({transactions}) => {
    useEffect(() => {
            if (transactions.length > 0) {
                const ctx = document.getElementById("transactionChart").getContext("2d");
                const categories = transactions.map((t) => t.category);
                const amounts = transactions.map((t) => t.amount);
    
                new Chart(ctx, {
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
                });
            }
        }, [transactions]);
  return (
      <div >
          <h3>Transaction Chart</h3>
          <canvas id="transactionChart"></canvas>
      </div>
  )
}

export default TransactionChart;