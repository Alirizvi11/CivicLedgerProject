import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const connectWallet = async () => {
    const res = await window.aptos.connect();
    localStorage.setItem("wallet", res.address);
    alert(`✅ Connected: ${res.address}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">🗳️ CivicLedger Login</h1>
      <button onClick={connectWallet} className="btn">🔗 Connect Wallet</button>
      <div className="mt-4 space-x-4">
        <button onClick={() => navigate("/dashboard/proposer")} className="btn">👤 I'm a Proposer</button>
        <button onClick={() => navigate("/dashboard/voter")} className="btn">🧑‍⚖️ I'm a Voter</button>
      </div>
    </div>
  );
}
