// src/context/WalletProvider.jsx
import React from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

const wallets = [new PetraWallet()];

export const WalletProvider = ({ children }) => {
  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      dappConfig={{ network: 'testnet' }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
