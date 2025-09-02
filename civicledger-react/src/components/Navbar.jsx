import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">🗳️ CivicLedger</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Login</Link>
        <Link to="/dashboard/proposer" className="hover:underline">Proposer</Link>
        <Link to="/dashboard/voter" className="hover:underline">Voter</Link>
        <Link to="/badge" className="hover:underline">Badge</Link>
      </div>
    </nav>
  );
}
