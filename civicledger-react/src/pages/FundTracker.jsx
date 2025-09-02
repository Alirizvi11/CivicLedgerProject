import React, { useEffect, useState } from 'react';
import FundChart from '../components/FundChart';
import FundTable from '../components/FundTable';
import { fetchFundEntries, fetchProposalList } from '../utils/fundApi';

export default function FundTracker() {
  const [entries, setEntries] = useState([]);
  const [proposalList, setProposalList] = useState([]);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    async function loadProposals() {
      const list = await fetchProposalList();
      setProposalList(list);
      if (list.length > 0) {
        setSelectedProposalId(list[0].id);
      }
    }
    loadProposals();
  }, []);

  useEffect(() => {
    async function loadEntries() {
      if (selectedProposalId !== null) {
        const data = await fetchFundEntries(selectedProposalId);
        setEntries(data);
      }
    }
    loadEntries();
  }, [selectedProposalId, refreshTrigger]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">FundFlow Tracker</h2>

      {/* ✅ Proposal Selector */}
      <select
        value={selectedProposalId || ''}
        onChange={(e) => setSelectedProposalId(parseInt(e.target.value))}
        className="border p-2 rounded mb-6 w-full"
      >
        {proposalList.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title} (ID: {p.id})
          </option>
        ))}
      </select>

      {/* ✅ Chart */}
      <div className="mb-8">
        <FundChart entries={entries} />
      </div>

      {/* ✅ Table */}
      <FundTable entries={entries} />
    </div>
  );
}
