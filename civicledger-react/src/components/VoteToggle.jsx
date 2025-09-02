import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { AptosClient } from '@aptos-labs/ts-sdk';

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com');

const VoteToggle = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [proposalId, setProposalId] = useState('');
  const [support, setSupport] = useState(true);

  const handleVote = async () => {
    const payload = {
      type: 'entry_function_payload',
      function: '0xd6516e5440520ebea764c6ea3d085ff7d7a276244c0caf5d68ff9b10034a041e::voting::vote',
      arguments: [account.address, parseInt(proposalId), support],
      type_arguments: [],
    };
    const tx = await signAndSubmitTransaction(payload);
    await client.waitForTransaction(tx.hash);
    alert('Vote submitted!');
  };

  return (
    <div>
      <h3>Vote on Proposal</h3>
      <input placeholder="Proposal ID" value={proposalId} onChange={e => setProposalId(e.target.value)} />
      <label>
        <input type="checkbox" checked={support} onChange={() => setSupport(!support)} />
        Support
      </label>
      <button onClick={handleVote}>Submit Vote</button>
    </div>
  );
};

export default VoteToggle;
