import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from "../firebase";


const TransactionContext = createContext();

export const useTransaction = () => useContext(TransactionContext);

const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const { currentUser } = useAuth();
  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  }

  const updateTransaction = async (id, updatedTransaction) => {
    try {
      const transactionRef = doc(db, "users", currentUser.uid, "transactions", id);
      await updateDoc(transactionRef, updatedTransaction);
      console.log(`Transaction ${id} updated successfully.`);
      // setTransactions((prev) => prev.map((transaction) => transaction.id === id ? updatedTransaction : transaction));
    } catch (e) {
console.log("update ",e.error)
    }
  }

  const deleteTransaction = async (id) => {
    try{const transactionRef = doc(db, "users", currentUser.uid, "transactions", id);
    await deleteDoc(transactionRef);
    console.log(`Transaction ${id} deleted successfully.`);}
    // setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    catch (e) {
      console.log("delete ",e.error);
    }
  }



  return (
    <TransactionContext.Provider
      value={{ transactions, setTransactions, addTransaction, updateTransaction, deleteTransaction }}
    >
      {children}
    </TransactionContext.Provider>

  )
}
export default TransactionProvider;
