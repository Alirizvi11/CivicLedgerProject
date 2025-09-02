import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { AptosClient } from '@aptos-labs/ts-sdk';

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com');

const ProposalForm = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = async () => {
    const payload = {
      type: 'entry_function_payload',
      function: '0xd651...041e::proposal_store::submit',
      arguments: [
        Array.from(new TextEncoder().encode(title)),
        Array.from(new TextEncoder().encode(description)),
        parseInt(budget),
      ],
      type_arguments: [],
    };
    const tx = await signAndSubmitTransaction(payload);
    await client.waitForTransaction(tx.hash);
    alert('Proposal submitted!');
  };

  return (
    <div>
      <h3>Submit Proposal</h3>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input placeholder="Budget" value={budget} onChange={e => setBudget(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ProposalForm;
