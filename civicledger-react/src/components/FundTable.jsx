import React from 'react';

export default function FundTable({ entries }) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return <p className="text-center text-gray-500">No transactions found.</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Transaction Logs</h3>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Category</th>
            <th className="p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{new Date(entry.timestamp * 1000).toLocaleDateString()}</td>
              <td className="p-2">{entry.is_inflow ? 'Inflow' : 'Outflow'}</td>
              <td className="p-2">₹{entry.amount}</td>
              <td className="p-2">{entry.category}</td>
              <td className="p-2">{entry.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
