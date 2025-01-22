import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext"; // For authentication
import { db } from "../firebase"; // Firestore instance
import { collection, query, onSnapshot, doc, updateDoc } from "firebase/firestore";
import AddIcon from '@mui/icons-material/Add';
import "./Dashboard.css"; // CSS for styling
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TransactionChart from "./TransactionChart";
import TransactionTable from "./TransactionTable";
import TransactionPopup from "./TransactionPopup";
import { useTransaction } from "../Context/TransactionContext";

const Dashboard = () => {
    const { currentUser, logout } = useAuth(); // Get the logged-in user and logout function
    // const [transactions, setTransactions] = useState([]);
    const [totalMoney, setTotalMoney] = useState(0); // Money from transactions
    const [userBudget, setUserBudget] = useState(0); // User's registered budget
    const [userName, setUserName] = useState("User"); // User's registered budget
    const [newBudget, setNewBudget] = useState(""); // Budget to be updated
    const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode
    const [isOpen, setIsOpen] = useState(false);
    const [remaining, setRemaining] = useState(0);
    const navigate = useNavigate(); // To navigate between pages
    const { transactions, setTransactions } = useTransaction();

    useEffect(() => {
        if (currentUser) {
            const userRef = doc(db, "users", currentUser.uid);
            const unsubscribeUser = onSnapshot(userRef, (doc) => {
                const userData = doc.data();
                setUserBudget(userData?.budget || 0);
                setUserName(userData?.name?.toUpperCase() || 0);

            });

            const q = query(collection(db, "users",currentUser.uid,"transactions"));
            const unsubscribeTransactions = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setTransactions(data);

                const total = data.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
                setTotalMoney(total);
                 onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
                    setRemaining((doc.data().budget)-total);
                    // console.log(doc.data(),remaining);
                });
                // const remain = userBudget - total;
                // setRemaining(remain);
            });

            return () => {
                unsubscribeUser();
                unsubscribeTransactions();
            };
        }
    }, [currentUser,setTransactions]);

    

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
    const handleFloatingButtonOpen = () => {
        setIsOpen(true);
    }
    const handleFloatingButtonClose = () => {
        setIsOpen(false);
    }

    return (
        <div className="dashboard">
            <div className="left-panel">
                <div className="user-avatar">
                    <img
                        src={
                            currentUser?.photoURL ||
                            "https://cdn-icons-png.flaticon.com/64/6596/6596121.png"
                        }
                        alt="User Avatar"
                    />
                    <button className="avatar-edit" onClick={handleAvatarEdit}>
                        <EditIcon />
                    </button>
                </div>
                <div className="welcome-message">
                    Welcome, {userName}!
                </div>
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
            <div className="center-panel">
                <TransactionChart transactions={transactions} />
            </div>
            <div className="bottom-panel"><TransactionTable transactions={transactions} /></div>
            <button className="floating-button" onClick={handleFloatingButtonOpen}><AddIcon/></button>
            {isOpen && <TransactionPopup open={handleFloatingButtonOpen } handleClose={ handleFloatingButtonClose} />}
        
        </div>
    );
};

export default Dashboard;
