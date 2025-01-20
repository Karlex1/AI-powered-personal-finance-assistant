import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext"; // For authentication
import { db } from "../firebase"; // Firestore instance
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Chart from "chart.js/auto";
import "./Dashboard.css"; // CSS for styling
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { currentUser, logout } = useAuth(); // Get the logged-in user and logout function
    const [transactions, setTransactions] = useState([]);
    const [totalMoney, setTotalMoney] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch transactions from Firestore for the current user
        if (currentUser) {
            const q = query(collection(db, "transactions"), where("userId", "==", currentUser.uid));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setTransactions(data);

                // Calculate total money
                const total = data.reduce((sum, transaction) => sum + transaction.amount, 0);
                setTotalMoney(total);
            });

            return unsubscribe; // Cleanup on component unmount
        }
    }, [currentUser]);

    useEffect(() => {
        // Initialize the chart with transaction data
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

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/"); // Redirect to login page
        } catch (error) {
            console.error("Failed to log out:", error.message);
        }
    };

    return (
        <div className="dashboard">
            {/* Left Panel */}
            <div className="left-panel">
                <div className="user-avatar">
                    <img
                        src={
                            currentUser?.photoURL ||
                            "https://cdn-icons-png.flaticon.com/64/6596/6596121.png"
                        }
                        alt="User Avatar"
                    />
                    <button onClick={() => alert("Feature to update avatar coming soon!")}>
                        Update Avatar
                    </button>
                </div>
                <div className="total-money">
                    <h3>Total Money</h3>
                    <p>${totalMoney.toFixed(2)}</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Center Panel */}
            <div className="center-panel">
                <h3>Transaction Chart</h3>
                <canvas id="transactionChart"></canvas>
            </div>

            {/* Bottom Panel */}
            <div className="bottom-panel">
                <h3>Recent Transactions</h3>
                <ul>
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <li key={transaction.id}>
                                <span>{transaction.description}</span>
                                <span>${transaction.amount.toFixed(2)}</span>
                            </li>
                        ))
                    ) : (
                        <li>No transactions found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
