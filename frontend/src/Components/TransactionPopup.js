import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const TransactionPopup = ({ open, handleClose }) => {
    const [form, setForm] = useState({ amount: "", category: "", date: "", description: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (auth.currentUser) {
            const transactionRef = collection(db, "users", auth.currentUser.uid, "transactions");
            await addDoc(transactionRef, form);
            handleClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogContent>
                <TextField label="Amount" name="amount" onChange={handleChange} fullWidth />
                <TextField label="Category" name="category" onChange={handleChange} fullWidth />
                <TextField type="date" name="date" onChange={handleChange} fullWidth />
                <TextField label="Description" name="description" onChange={handleChange} fullWidth />
                <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionPopup;
