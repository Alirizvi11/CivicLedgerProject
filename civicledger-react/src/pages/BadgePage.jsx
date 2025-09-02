export default function BadgePage() {
  const claimBadge = async () => {
    const payload = {
      type: "entry_function_payload",
      function: "0xd6516e5440520ebea764c6ea3d085ff7d7a276244c0caf5d68ff9b10034a041e::civic_badge::claim_badge",
      arguments: [],
      type_arguments: []
    };

    try {
      const tx = await window.aptos.signAndSubmitTransaction({ payload });
      alert(`✅ Badge claimed! TX: ${tx.hash}`);
    } catch (err) {
      alert("❌ Badge claim failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🏅 Claim Your Badge</h2>
      <button onClick={claimBadge} className="btn">Claim Badge</button>
    </div>
  );
}
