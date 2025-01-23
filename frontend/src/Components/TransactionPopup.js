import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const TransactionPopup = ({ open, handleClose }) => {
    const [form, setForm] = useState({ amount: "", category: "", date: "", description: "" });
    const [categorylengthError, setCategorylengthError] = useState("");
    const MAX_LENGTH = 20;

    const handleChange = (e) => {
        const{name, value} = e.target;
        if (name === "category" && value.length > MAX_LENGTH) {
            setCategorylengthError(`Category canonot more than ${MAX_LENGTH} character...`);
        } else {
            setCategorylengthError("");
        }
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (auth.currentUser) {
            try {
                const transactionRef = collection(db, "users", auth.currentUser.uid, "transactions");
                const transactionData = {
                    ...form,
                    amount: parseFloat(form.amount), // Ensure amount is a number
                    date: form.date || new Date().toISOString(),
                    userId: auth.currentUser.uid,
                }
            await addDoc(transactionRef,transactionData);
             
            } catch (e) {
                console.log("popup error-"+e.message);
            }finally{
             handleClose();  }
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogContent>
                <TextField label="Amount" name="amount" onChange={handleChange} fullWidth />
                <TextField label="Category" name="category" error={!!categorylengthError} helperText={categorylengthError }  onChange={handleChange} fullWidth />
                <TextField type="date" name="date" onChange={handleChange} fullWidth />
                <TextField label="Description" name="description" onChange={handleChange} fullWidth />
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={categorylengthError}>Save</Button>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionPopup;
