import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext"; // For authentication
import { db } from "../firebase"; // Firestore instance
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import Chart from "chart.js/auto";
import "./Dashboard.css"; // CSS for styling
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const Dashboard = () => {
    const { currentUser, logout } = useAuth(); // Get the logged-in user and logout function
    const [transactions, setTransactions] = useState([]);
    const [totalMoney, setTotalMoney] = useState(0); // Money from transactions
    const [userBudget, setUserBudget] = useState(0); // User's registered budget
    const [newBudget, setNewBudget] = useState(""); // Budget to be updated
    const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode
    const navigate = useNavigate(); // To navigate between pages

    useEffect(() => {
        // Fetch user details (including budget) from Firestore
        if (currentUser) {
            const userRef = doc(db, "users", currentUser.uid);
            const unsubscribeUser = onSnapshot(userRef, (doc) => {
                const userData = doc.data();
                setUserBudget(userData?.budget || 0); // Set the user's registered budget
            });

            // Fetch transactions from Firestore for the current user
            const q = query(collection(db, "transactions"), where("userId", "==", currentUser.uid));
            const unsubscribeTransactions = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setTransactions(data);

                // Calculate total money from transactions
                const total = data.reduce((sum, transaction) => sum + transaction.amount, 0);
                setTotalMoney(total);
            });

            return () => {
                unsubscribeUser();
                unsubscribeTransactions(); // Cleanup on component unmount
            };
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

    const handleIncome = async () => {
        try {
            // Update the user's budget in Firestore
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                budget: parseFloat(newBudget), // Update budget
            });
            setUserBudget(newBudget); // Update the local state to reflect the new budget
            setNewBudget(""); // Clear input field
            setIsEditing(false); // Exit edit mode
        } catch (error) {
            console.error("Failed to update budget:", error.message);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true); // Enter edit mode
        setNewBudget(userBudget); // Pre-fill input with current budget
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

                {/* Budget Display */}
                <div className="total-money">
                    Budget : 
                    {isEditing ? (
                        <>
                            <input
                                type="number"
                                placeholder="Update Budget"
                                value={newBudget}
                                onChange={(e) => setNewBudget(e.target.value)} // Update budget state
                            />

                            <SaveIcon onClick={handleIncome} />

                        </>
                    ) : (
                        <>
                             ${userBudget.toFixed(2)}{/* Display the registered budget */}
                            <EditIcon onClick={handleEditClick} />
                        </>
                    )}
                </div>
                <div className="total-money">Spend : ${totalMoney.toFixed(2)} </div>
                <LogoutIcon onClick={handleLogout} />
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
