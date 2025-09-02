export async function fetchProposalList() {
  // Mock data — replace with REST or on-chain fetch later
  return [
    { id: 1, title: "Community Grant Proposal" },
    { id: 2, title: "Infrastructure Upgrade" },
    { id: 3, title: "Developer Bounty Program" },
  ];
}

export async function fetchFundEntries(proposalId) {
  // Dummy entries — replace with on-chain fetch
  return [
    { category: "Development", amount: 2000, description: "Dev tools", timestamp: 1692787200, is_inflow: false },
    { category: "Infrastructure", amount: 1500, description: "Server cost", timestamp: 1692873600, is_inflow: false },
    { category: "Marketing", amount: 1000, description: "Social media", timestamp: 1692960000, is_inflow: false },
  ];
}

export async function fetchRemainingBudget(proposalId) {
  // Dummy logic — replace with Aptos view function
  const totalBudget = 10000;
  const spent = 4500;
  return totalBudget - spent;
}

export async function logExpenseTx(wallet, proposalId, label, amount) {
  console.log(`Logging expense: ${label} ₹${amount} for proposal ${proposalId}`);
  return "0xmocktxhash123";
}

export async function approveProposalTx(wallet, proposalId) {
  console.log(`Approving proposal ${proposalId}`);
  return "0xmocktxhash456";
}
