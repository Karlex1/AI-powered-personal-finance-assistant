import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { db } from "../firebase";
import { collection, query, onSnapshot, doc, updateDoc } from "firebase/firestore";
import AddIcon from '@mui/icons-material/Add';
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TransactionChart from "./TransactionChart";
import TransactionTable from "./TransactionTable";
import TransactionPopup from "./TransactionPopup";
import { useTransaction } from "../Context/TransactionContext";

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const [totalMoney, setTotalMoney] = useState(0);
    const [userBudget, setUserBudget] = useState(0);
    const [userName, setUserName] = useState("User");
    const [newBudget, setNewBudget] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [remaining, setRemaining] = useState(0);
    const [leftPanelOpen, setLeftPanelOpen] = useState(false); // State for left panel visibility
    const navigate = useNavigate();
    const { transactions, setTransactions } = useTransaction();

    useEffect(() => {
        if (currentUser) {
            const userRef = doc(db, "users", currentUser.uid);
            const unsubscribeUser = onSnapshot(userRef, (doc) => {
                const userData = doc.data();
                setUserBudget(userData?.budget || 0);
                setUserName(userData?.name?.toUpperCase() || 0);
            });

            const q = query(collection(db, "users", currentUser.uid, "transactions"));
            const unsubscribeTransactions = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setTransactions(data);

                const total = data.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
                setTotalMoney(total);

                onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
                    setRemaining(doc.data().budget - total);
                });
            });

            return () => {
                unsubscribeUser();
                unsubscribeTransactions();
            };
        }
    }, [currentUser, setTransactions]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Failed to log out:", error.message);
        }
    };

    const handleIncome = async () => {
        try {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                budget: parseFloat(newBudget),
            });
            setUserBudget(newBudget);
            setNewBudget("");
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update budget:", error.message);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setNewBudget(userBudget);
    };

    const handleAvatarEdit = () => {
        alert("Feature to update avatar coming soon!");
    };

    const toggleLeftPanel = () => {
        setLeftPanelOpen(!leftPanelOpen); // Toggle the left panel
    };

    return (
        <div className="dashboard">
            {/* Hamburger Menu for toggling left panel */}
            <div className="hamburger-menu" onClick={toggleLeftPanel}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* Left Panel */}
            <div className={`left-panel ${leftPanelOpen ? "open" : ""}`}>
                <div className="user-avatar">
                    <img
                        src={currentUser?.photoURL || "https://cdn-icons-png.flaticon.com/64/6596/6596121.png"}
                        alt="User Avatar"
                    />
                    <button className="avatar-edit" onClick={handleAvatarEdit}>
                        <EditIcon />
                    </button>
                </div>
                <div className="welcome-message">Welcome, {userName}!</div>
                <div className="money">
                    Budget : &nbsp;
                    {isEditing ? (
                        <>
                            <input
                                type="number"
                                placeholder="Update Budget"
                                value={newBudget}
                                onChange={(e) => setNewBudget(e.target.value)}
                            />
                            <SaveIcon onClick={handleIncome} />
                        </>
                    ) : (
                        <>
                            ${userBudget}
                            <EditIcon onClick={handleEditClick} />
                        </>
                    )}
                </div>
                <div className="money">Spend : ${totalMoney} </div>
                <div className="money">Money Left: ${remaining} </div>
                <LogoutIcon onClick={handleLogout} />
            </div>

            {/* Center Panel */}
            <div className="center-panel">
                <TransactionChart transactions={transactions} />
            </div>

            {/* Bottom Panel */}
            <div className="bottom-panel">
                <TransactionTable transactions={transactions} />
            </div>

            {/* Floating Button */}
            <button className="floating-button" onClick={() => setIsOpen(true)}>
                <AddIcon />
            </button>

            {/* Transaction Popup */}
            {isOpen && <TransactionPopup open={setIsOpen} handleClose={() => setIsOpen(false)} />}
        </div>
    );
};

export default Dashboard;
