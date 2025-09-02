// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { ClaimOptions } from '@aptos-connect/wallet-api';
import {
  AccountAddress,
  AccountAuthenticator,
  AnyRawTransaction,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  HexInput,
  MultiAgentTransaction,
  Network,
  NetworkToNodeAPI,
  SimpleTransaction,
} from '@aptos-labs/ts-sdk';
import {
  AccountInfo,
  APTOS_CHAINS,
  AptosSignAndSubmitTransactionInput,
  AptosSignAndSubmitTransactionOutput,
  AptosSignInInput,
  AptosSignInOutput,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  AptosSignTransactionInputV1_1,
  AptosSignTransactionOutputV1_1,
  AptosWalletError,
  AptosWalletErrorCode,
  NetworkInfo,
  UserResponse,
  UserResponseStatus,
} from '@aptos-labs/wallet-standard';
import { deserializePublicKeyB64, serializePublicKeyB64 } from '@identity-connect/crypto';
import { ACDappClient, ACDappClientConfig } from '@identity-connect/dapp-sdk';
import { AptosConnectAccount } from './AptosConnectAccount';
import { customAccountToStandardAccount, networkToChainId, unwrapUserResponse } from './helpers';

interface SerializedCurrentAccount {
  address: string;
  publicKey: string;
}

type WithSSOProvider<T> = T & {
  provider: 'google' | 'apple';
};

export interface AptosConnectWalletConfig extends Omit<ACDappClientConfig, 'defaultNetworkName' | 'provider'> {
  claimSecretKey?: HexInput;
  network?: Network;
  preferredWalletName?: string;
}

export abstract class AptosConnectWallet {
  // region connectedAccount

  protected static connectedAccountStorageKey = '@aptos-connect/connectedAccount';

  protected static get connectedAccount(): AccountInfo | undefined {
    const serialized = localStorage.getItem(AptosConnectWallet.connectedAccountStorageKey);
    if (!serialized) {
      return undefined;
    }

    try {
      const { address, publicKey } = JSON.parse(serialized) as SerializedCurrentAccount;
      return new AccountInfo({
        address: AccountAddress.from(address),
        publicKey: deserializePublicKeyB64(publicKey),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Inconsistent state, resetting it');
      this.connectedAccount = undefined;
      return undefined;
    }
  }

  protected static set connectedAccount(value: AccountInfo | undefined) {
    if (value !== undefined) {
      const serialized: SerializedCurrentAccount = {
        address: value.address.toString(),
        publicKey: serializePublicKeyB64(value.publicKey),
      };
      localStorage.setItem(AptosConnectWallet.connectedAccountStorageKey, JSON.stringify(serialized));
    } else {
      localStorage.removeItem(AptosConnectWallet.connectedAccountStorageKey);
    }
  }

  // endregion

  // region AptosWallet

  readonly version = '1.0.0';

  readonly chains = APTOS_CHAINS;

  // eslint-disable-next-line class-methods-use-this
  get accounts() {
    const { connectedAccount } = AptosConnectWallet;
    return connectedAccount ? [new AptosConnectAccount(connectedAccount)] : [];
  }

  // endregion

  // PetraWallet

  private readonly aptosClient: Aptos;

  private readonly client: ACDappClient;

  private readonly preferredWalletName?: string;
  private readonly claimOptions?: ClaimOptions;

  constructor({
    claimSecretKey,
    network = Network.MAINNET,
    preferredWalletName,
    ...clientConfig
  }: WithSSOProvider<AptosConnectWalletConfig>) {
    this.client = new ACDappClient(clientConfig);

    if (!NetworkToNodeAPI[network]) {
      throw new Error('Network not supported');
    }

    const aptosConfig = new AptosConfig({ network });
    this.aptosClient = new Aptos(aptosConfig);
    this.preferredWalletName = preferredWalletName;
    this.claimOptions = claimSecretKey ? { network, secretKey: new Ed25519PrivateKey(claimSecretKey) } : undefined;
  }

  async connect(): Promise<UserResponse<AccountInfo>> {
    // If this is an auto-connect, try not opening the prompt
    const { connectedAccount } = AptosConnectWallet;
    if (connectedAccount !== undefined) {
      return { args: connectedAccount, status: UserResponseStatus.APPROVED };
    }

    const response = await this.client.connect({
      claimOptions: this.claimOptions,
      preferredWalletName: this.preferredWalletName,
    });
    if (response.status === 'dismissed') {
      return { status: UserResponseStatus.REJECTED };
    }

    const newConnectedAccount = customAccountToStandardAccount(response.args.account);
    AptosConnectWallet.connectedAccount = newConnectedAccount;

    return {
      args: newConnectedAccount,
      status: UserResponseStatus.APPROVED,
    };
  }

  async disconnect() {
    const { connectedAccount } = AptosConnectWallet;
    if (connectedAccount) {
      await this.client.disconnect(connectedAccount.address);
      AptosConnectWallet.connectedAccount = undefined;
    }
  }

  async signIn(input: AptosSignInInput): Promise<UserResponse<AptosSignInOutput>> {
    const response = await this.client.signIn({ network: this.aptosClient.config.network, ...input });

    if (response.status === 'dismissed') {
      return { status: UserResponseStatus.REJECTED };
    }

    const output = response.args;

    AptosConnectWallet.connectedAccount = output.account;

    return { args: output, status: UserResponseStatus.APPROVED };
  }

  // eslint-disable-next-line class-methods-use-this
  async getAccount(): Promise<AccountInfo> {
    const { connectedAccount } = AptosConnectWallet;
    if (!connectedAccount) {
      // TODO: this function should fail gracefully
      throw new AptosWalletError(AptosWalletErrorCode.Unauthorized);
    }
    return customAccountToStandardAccount(connectedAccount);
  }

  async getNetwork(): Promise<NetworkInfo> {
    const { network } = this.aptosClient.config;
    const chainId = await this.aptosClient.getChainId();
    const url = NetworkToNodeAPI[network];
    return {
      chainId,
      name: network,
      url,
    };
  }

  async signMessage(input: AptosSignMessageInput): Promise<UserResponse<AptosSignMessageOutput>> {
    const { connectedAccount } = AptosConnectWallet;
    if (!connectedAccount) {
      throw new AptosWalletError(AptosWalletErrorCode.Unauthorized);
    }

    const chainId = networkToChainId(this.aptosClient.config.network);
    const { message, nonce } = input;

    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    const nonceBytes = encoder.encode(nonce);

    const response = await this.client.signMessage({
      chainId,
      message: messageBytes,
      nonce: nonceBytes,
      signerAddress: connectedAccount.address,
    });

    if (response.status === 'dismissed') {
      return { status: UserResponseStatus.REJECTED };
    }

    const { fullMessage, signature } = response.args;

    const extraResponseArgs = {
      address: connectedAccount.address.toString(),
      application: this.client.dappInfo.domain,
      chainId,
      message,
      nonce,
      prefix: 'APTOS' as const,
    };

    return {
      args: {
        fullMessage,
        signature,
        ...extraResponseArgs,
      },
      status: UserResponseStatus.APPROVED,
    };
  }

  async signTransaction(rawTxn: AnyRawTransaction): Promise<UserResponse<AccountAuthenticator>>;
  async signTransaction(args: AptosSignTransactionInputV1_1): Promise<UserResponse<AptosSignTransactionOutputV1_1>>;
  async signTransaction(
    txnOrArgs: AnyRawTransaction | AptosSignTransactionInputV1_1,
    _asFeePayer?: boolean,
  ): Promise<UserResponse<AccountAuthenticator | AptosSignTransactionOutputV1_1>> {
    const { connectedAccount } = AptosConnectWallet;
    if (!connectedAccount) {
      throw new AptosWalletError(AptosWalletErrorCode.Unauthorized);
    }

    if ('bcsToBytes' in txnOrArgs) {
      const transaction = txnOrArgs;
      const feePayer = transaction.feePayerAddress ? { address: transaction.feePayerAddress } : undefined;
      const secondarySigners = transaction.secondarySignerAddresses?.map((address) => ({ address }));
      const response = await this.client.signTransaction({
        feePayer,
        secondarySigners,
        signerAddress: connectedAccount.address,
        transaction: transaction.rawTransaction,
      });
      return unwrapUserResponse(response, (args) => args.authenticator);
    }

    const requestArgs = txnOrArgs;
    const response = await this.client.signTransaction({
      ...requestArgs,
      signerAddress: connectedAccount.address,
    });

    return unwrapUserResponse(response, (responseArgs) => {
      const { authenticator, rawTransaction } = responseArgs;
      if (!rawTransaction) {
        throw new Error('Expected raw transaction in response args');
      }

      const secondarySigners = requestArgs.secondarySigners ?? [];
      let transaction: AnyRawTransaction;
      if (secondarySigners.length > 0) {
        transaction = new MultiAgentTransaction(
          rawTransaction,
          secondarySigners.map((s) => s.address),
          requestArgs.feePayer?.address,
        );
      } else {
        transaction = new SimpleTransaction(rawTransaction, requestArgs.feePayer?.address);
      }

      return {
        authenticator,
        rawTransaction: transaction,
      };
    });
  }

  async signAndSubmitTransaction(
    args: AptosSignAndSubmitTransactionInput,
  ): Promise<UserResponse<AptosSignAndSubmitTransactionOutput>> {
    const { gasUnitPrice, maxGasAmount, payload } = args;

    const { connectedAccount } = AptosConnectWallet;
    if (!connectedAccount) {
      throw new AptosWalletError(AptosWalletErrorCode.Unauthorized);
    }

    const response = await this.client.signAndSubmitTransaction({
      gasUnitPrice,
      maxGasAmount,
      network: this.aptosClient.config.network,
      payload,
      signerAddress: connectedAccount.address,
    });

    if (response.status === 'dismissed') {
      return { status: UserResponseStatus.REJECTED };
    }

    return {
      args: { hash: response.args.txnHash },
      status: UserResponseStatus.APPROVED,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async onAccountChange(_callback?: (newAccount: AccountInfo) => void): Promise<void> {
    // TODO
  }

  // eslint-disable-next-line class-methods-use-this
  async onNetworkChange(_callback?: (newNetwork: NetworkInfo) => void): Promise<void> {
    // Not applicable
  }

  // endregion
}
