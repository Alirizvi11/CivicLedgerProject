// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { registerWallet } from '@aptos-labs/wallet-standard';
import { AptosConnectWalletConfig } from './AptosConnectWallet';
import { AptosConnectGoogleWallet } from './AptosConnectGoogleWallet';
import { AptosConnectAppleWallet } from './AptosConnectAppleWallet';

export * from './AptosConnectAccount';
export * from './AptosConnectWallet';
export { AptosConnectGoogleWallet, AptosConnectAppleWallet };

export function registerAptosConnect(config: AptosConnectWalletConfig = {}) {
  const googleWalletPlugin = new AptosConnectGoogleWallet(config);
  const appleWalletPlugin = new AptosConnectAppleWallet(config);
  registerWallet(googleWalletPlugin);
  registerWallet(appleWalletPlugin);
}
