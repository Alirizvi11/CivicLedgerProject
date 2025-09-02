// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  AccountAddress,
  AnyPublicKey,
  Ed25519PublicKey,
  MultiEd25519PublicKey,
  MultiKey,
  PublicKey,
  SigningScheme,
} from '@aptos-labs/ts-sdk';
import { AccountInfo, APTOS_CHAINS, AptosWalletAccount } from '@aptos-labs/wallet-standard';

export class AptosConnectAccount implements AptosWalletAccount {
  // region AptosWalletAccount

  readonly chains = APTOS_CHAINS;

  get address() {
    return this.#address.toString();
  }

  get publicKey() {
    return this.#publicKey.toUint8Array();
  }

  get signingScheme() {
    if (this.#publicKey instanceof Ed25519PublicKey) {
      return SigningScheme.Ed25519;
    }
    if (this.#publicKey instanceof MultiEd25519PublicKey) {
      return SigningScheme.MultiEd25519;
    }
    if (this.#publicKey instanceof AnyPublicKey) {
      return SigningScheme.SingleKey;
    }
    if (this.#publicKey instanceof MultiKey) {
      return SigningScheme.MultiKey;
    }
    throw new Error('Unsupported public key type');
  }

  readonly label?: string;

  readonly features = [];

  // endregion

  // region PetraAccount

  readonly #address: AccountAddress;

  readonly #publicKey: PublicKey;

  constructor({ address, ansName, publicKey }: AccountInfo) {
    this.#publicKey = publicKey;
    this.#address = address;
    this.label = ansName;
  }

  // endregion
}
