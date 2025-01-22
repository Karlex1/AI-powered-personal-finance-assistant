import React,{createContext,useContext,useState} from 'react';


const TransactionContext=createContext();

export const useTransaction=()=>useContext(TransactionContext);

const TransactionProvider=({children})=>{
    const [transactions,setTransactions]=useState([]);

    const addTransaction=(transaction)=>{
        setTransactions((prev)=>[...prev,transaction]);
    }

    const updateTransaction=(id,updatedTransaction)=>{
        setTransactions((prev)=>prev.map((transaction)=>transaction.id===id?updatedTransaction:transaction));
    }

    const deleteTransaction=(id)=>{
        setTransactions((prev)=>prev.filters((transaction)=>transaction.id !== id));
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
