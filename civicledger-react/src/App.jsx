import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProposerDashboard from "./pages/ProposerDashboard";
import VoterDashboard from "./pages/VoterDashboard";
import BadgePage from "./pages/BadgePage";
import ProposalDetails from "./pages/ProposalDetails";
import Navbar from "./components/Navbar";
import FundChartContainer from "./components/FundChartContainer"; // ✅ updated import

export default function App() {
  const aptosAddress = "0xd6516e5440520ebea764c6ea3d085ff7d7a276244c0caf5d68ff9b10034a041e";

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard/proposer" element={<ProposerDashboard />} />
          <Route path="/dashboard/voter" element={<VoterDashboard />} />
          <Route path="/badge" element={<BadgePage />} />
          <Route path="/proposal/:id" element={<ProposalDetails />} />
        </Routes>

        {/* ✅ FundFlow Tracker Section */}
        <div className="mt-10 p-6 bg-white rounded shadow max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">FundFlow Tracker</h2>
          <FundChartContainer address={aptosAddress} />
        </div>
      </div>
    </Router>
  );
}
