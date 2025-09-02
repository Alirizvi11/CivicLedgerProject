// src/components/FundChartContainer.jsx
import React, { useEffect, useState } from 'react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import FundChart from './FundChart';

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

const FundChartContainer = ({ address }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const resource = await aptos.getAccountResource({
          accountAddress: address,
          resourceType: '0xd6516e5440520ebea764c6ea3d085ff7d7a276244c0caf5d68ff9b10034a041e::fund_ledger::FundLedger'
        });
        setEntries(resource.data.entries);
      } catch (err) {
        console.error('Error fetching fund entries:', err);
      }
    };

    fetchEntries();
  }, [address]);

  return <FundChart entries={entries} />;
};

export default FundChartContainer;
