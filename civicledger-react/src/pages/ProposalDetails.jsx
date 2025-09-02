import React, { useEffect, useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import {
  fetchRemainingBudget,
  fetchProposalList,
  logExpenseTx,
  approveProposalTx,
} from '../utils/fundApi';

export default function ProposalDetails() {
  const { account, signAndSubmitTransaction, waitForTransaction } = useWallet();
  const wallet = { signAndSubmitTransaction, waitForTransaction };

  const [proposalList, setProposalList] = useState([]);
  const [proposalId, setProposalId] = useState(null);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    async function loadProposals() {
      const list = await fetchProposalList();
      setProposalList(list);
      if (list.length > 0) {
        setProposalId(list[0].id);
      }
    }
    loadProposals();
  }, []);

  useEffect(() => {
    async function loadBudget() {
      if (proposalId !== null) {
        const budget = await fetchRemainingBudget(proposalId);
        setRemainingBudget(budget);
      }
    }
    loadBudget();
  }, [proposalId, refreshTrigger]);

  const handleLogExpense = async () => {
    const txHash = await logExpenseTx(wallet, proposalId, label, amount);
    if (txHash) {
      alert(`Expense logged! Tx: ${txHash}`);
      setRefreshTrigger(!refreshTrigger);
      setLabel('');
      setAmount('');
    }
  };

  const handleApproveProposal = async () => {
    const txHash = await approveProposalTx(wallet, proposalId);
    if (txHash) {
      alert(`Proposal approved! Tx: ${txHash}`);
      setRefreshTrigger(!refreshTrigger);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Proposal Details</h2>

      {/* ✅ Proposal Selector */}
      <select
        value={proposalId || ''}
        onChange={(e) => setProposalId(parseInt(e.target.value))}
        className="border p-2 rounded mb-4 w-full"
      >
        {proposalList.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title} (ID: {p.id})
          </option>
        ))}
      </select>

      {/* ✅ Remaining Budget Display */}
      <p className="text-lg font-bold text-green-700 mb-4">
        Remaining Budget: ₹{remainingBudget}
      </p>

      {/* ✅ Expense Form */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Log New Expense</h3>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Expense Label"
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="border p-2 rounded w-full mb-2"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleLogExpense}
        >
          Log Expense
        </button>
      </div>

      {/* ✅ Approve Proposal Button */}
      <div className="mt-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleApproveProposal}
        >
          Approve Proposal
        </button>
      </div>
    </div>
  );
}
