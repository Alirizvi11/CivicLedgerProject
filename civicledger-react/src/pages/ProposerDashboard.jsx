
import { useState, useEffect } from "react";
import ProposalCard from "../components/ProposalCard";



const MODULE_ADDRESS = "0xd6516e5440520ebea764c6ea3d085ff7d7a276244c0caf5d68ff9b10034a041e";

export default function ProposerDashboard() {
  const [title, setTitle] = useState("");
  const [proposals, setProposals] = useState([]);

  const address = localStorage.getItem("wallet");

  const submitProposal = async () => {
    if (!address || !title) return alert("Connect wallet and enter title");

    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::voting::create`,
      arguments: [title],
      type_arguments: []
    };

    try {
      const tx = await window.aptos.signAndSubmitTransaction({ payload });
      alert(`✅ Proposal submitted! TX: ${tx.hash}`);
      setTitle("");
      loadProposals();
    } catch (err) {
      alert("❌ Proposal failed");
    }
  };

  const loadProposals = async () => {
    try {
      const lenRes = await fetch("https://fullnode.testnet.aptoslabs.com/v1/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          function: `${MODULE_ADDRESS}::voting::proposals_len`,
          type_arguments: [],
          arguments: [address]
        })
      });

      const lenJson = await lenRes.json();
      const count = Array.isArray(lenJson) ? lenJson[0] : 0;

      const loaded = [];
      for (let i = 0; i < count; i++) {
        const propRes = await fetch("https://fullnode.testnet.aptoslabs.com/v1/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            function: `${MODULE_ADDRESS}::voting::borrow_proposal`,
            type_arguments: [],
            arguments: [address, i.toString()]
          })
        });

        const result = await propRes.json();
        const titleBytes = result[0];
        const title = new TextDecoder().decode(Uint8Array.from(titleBytes));
        loaded.push({
          title,
          yes: result[1],
          no: result[2],
          active: result[3]
        });
      }

      setProposals(loaded);
    } catch (err) {
      console.error("❌ Failed to load proposals:", err);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📤 Submit Proposal</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Proposal title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={submitProposal} className="btn mb-6">Submit</button>

      <h2 className="text-xl font-bold mb-4">📋 Your Proposals</h2>
      {proposals.length === 0 ? (
        <p>No proposals found.</p>
      ) : (
        proposals.map((p, idx) => (
          <ProposalCard key={idx} {...p} />
        ))
      )}
    </div>
  );
}
