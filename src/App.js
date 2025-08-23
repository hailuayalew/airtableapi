import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [date, setDate] = useState("");
  const [transferto, setTransferto] = useState("");
  const [trxid, setTrxid] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      const res = await api.get();
      setTransactions(res.data.records);
    } catch (err) {
      console.error(
        "Error fetching transactions:",
        err.response?.data || err.message
      );
    }
  };

  // Create or update transaction
  const saveTransaction = async () => {
    if (!amount || !balance || !date || !transferto || !trxid) {
      alert("Please fill in all fields");
      return;
    }

    const data = {
      fields: {
        amount: parseFloat(amount),
        balance: parseFloat(balance),
        date: date,
        transferto: transferto,
        trxid: trxid,
      },
    };

    try {
      if (editId) {
        await api.patch(`/${editId}`, data);
      } else {
        await api.post("", data);
      }
      fetchTransactions();
      resetForm();
    } catch (err) {
      console.error(
        "Error creating/updating:",
        err.response?.data || err.message
      );
      alert("Error creating/updating: " + JSON.stringify(err.response?.data));
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    try {
      await api.delete(`/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error("Error deleting:", err.response?.data || err.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setAmount("");
    setBalance("");
    setDate("");
    setTransferto("");
    setTrxid("");
    setEditId(null);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>💰 Bank Transactions</h1>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Transfer To"
          value={transferto}
          onChange={(e) => setTransferto(e.target.value)}
        />
        <input
          type="text"
          placeholder="Transaction ID"
          value={trxid}
          onChange={(e) => setTrxid(e.target.value)}
        />
        <button onClick={saveTransaction}>{editId ? "Update" : "Add"}</button>
        {editId && <button onClick={resetForm}>Cancel</button>}
      </div>

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Amount</th>
            <th>Balance</th>
            <th>Date</th>
            <th>Transfer To</th>
            <th>Transaction ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No transactions found
              </td>
            </tr>
          )}
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.fields.amount}</td>
              <td>{tx.fields.balance}</td>
              <td>{tx.fields.date}</td>
              <td>{tx.fields.transferto}</td>
              <td>{tx.fields.trxid}</td>
              <td>
                <button
                  onClick={() => {
                    setEditId(tx.id);
                    setAmount(tx.fields.amount);
                    setBalance(tx.fields.balance);
                    setDate(tx.fields.date);
                    setTransferto(tx.fields.transferto || "");
                    setTrxid(tx.fields.trxid || "");
                  }}
                >
                  Edit
                </button>{" "}
                <button onClick={() => deleteTransaction(tx.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
