import React, { useState } from "react";
import TransactionPopup from "./TransactionPopup";

const Dashboard = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <div>
            <button onClick={() => setIsPopupOpen(true)}>Add Transaction</button>
            <TransactionPopup open={isPopupOpen} handleClose={() => setIsPopupOpen(false)} />
        </div>
    );
};

export default Dashboard;
