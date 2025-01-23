import React, { useState } from 'react'
import { useTransaction } from '../Context/TransactionContext';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TransactionTable = ({ transactions }) => {
    const { updateTransaction, deleteTransaction } = useTransaction();
    const [editingId, setEditingId] = useState(null);
    const [editedTransaction, setEditedTransaction] = useState({});

    const handleEditClick = (transaction) => {
        setEditingId(transaction.id);
        setEditedTransaction(transaction);
        // console.log("button clicked edit");
    }
    const handleSaveClick = () => {
        updateTransaction(editingId, editedTransaction);
        setEditingId(null);
        // console.log("button clicked save");
    }
    const handleDelete = (id) => {
        deleteTransaction(id);
        // console.log("button clicked delete");
    }

  return (
      <div >
          <h3>Recent Transactions</h3>
          <ul>
              {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                      <li key={transaction.id}>
                          {(editingId === transaction.id) ? (<>
                              <input
                                  type="text"
                                  value={editedTransaction.description}
                                  onChange={(e) =>
                                      setEditedTransaction({ ...editedTransaction, description: e.target.value })
                                  }
                              />
                              <input
                                  type="number"
                                  value={editedTransaction.amount}
                                  onChange={(e) =>
                                      setEditedTransaction({ ...editedTransaction, amount: e.target.value })
                                  }
                              />
                              <input
                                  type="date"
                                  value={editedTransaction.date}
                                  onChange={(e) =>
                                      setEditedTransaction({ ...editedTransaction, date: e.target.value })
                                  }
                              />
                              <button onClick={handleSaveClick}><SaveIcon/></button>
                          </>) : <>
                          <span>{transaction.description}</span>
                          <span>${transaction.amount}</span>
                                  <span>{transaction.date}</span>
                                 <span> <EditIcon onClick={()=>handleEditClick(transaction)} /></span>
                                  <span><DeleteIcon onClick={()=>handleDelete(transaction.id)} /></span></>}
                      </li>
                  ))
              ) : (
                  <li>No transactions found.</li>
              )}
          </ul>
      </div>
  )
}

export default TransactionTable