export default function ProposalCard({ title, yes, no, active }) {
  return (
    <div className="border rounded p-4 shadow mb-4 bg-white">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p>✅ Yes: {yes}</p>
      <p>❌ No: {no}</p>
      <p>🔄 Active: {active ? "Yes" : "No"}</p>
    </div>
  );
}
