import React from 'react'

const TransactionTable=({transactions})=> {
  return (
      <div >
          <h3>Recent Transactions</h3>
          <ul>
              {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                      <li key={transaction.id}>
                          <span>{transaction.description}</span>
                          <span>${transaction.amount}</span>
                          <span>{transaction.date}</span>
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