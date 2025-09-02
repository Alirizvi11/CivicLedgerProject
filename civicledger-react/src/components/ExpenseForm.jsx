import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { AptosClient } from '@aptos-labs/ts-sdk';

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com');

const ExpenseForm = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [proposalId, setProposalId] = useState('');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');

  const handleLog = async () => {
    const payload = {
      type: 'entry_function_payload',
      function: '0xd6516e5440520ebea764c6ea3d085ff7d7a276244c0caf5d68ff9b10034a041e::proposal_store::log_expense',
      arguments: [parseInt(proposalId), Array.from(new TextEncoder().encode(label)), parseInt(amount)],
      type_arguments: [],
    };
    const tx = await signAndSubmitTransaction(payload);
    await client.waitForTransaction(tx.hash);
    alert('Expense logged!');
  };

  return (
    <div>
      <h3>Log Expense</h3>
      <input placeholder="Proposal ID" value={proposalId} onChange={e => setProposalId(e.target.value)} />
      <input placeholder="Label" value={label} onChange={e => setLabel(e.target.value)} />
      <input placeholder="Amount (u64)" value={amount} onChange={e => setAmount(e.target.value)} />
      <button onClick={handleLog}>Log Expense</button>
    </div>
  );
};

export default ExpenseForm;
