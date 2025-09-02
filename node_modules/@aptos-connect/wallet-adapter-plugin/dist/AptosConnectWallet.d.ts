import { AccountAuthenticator, AnyRawTransaction, HexInput, Network } from '@aptos-labs/ts-sdk';
import { AccountInfo, AptosSignAndSubmitTransactionInput, AptosSignAndSubmitTransactionOutput, AptosSignInInput, AptosSignInOutput, AptosSignMessageInput, AptosSignMessageOutput, AptosSignTransactionInputV1_1, AptosSignTransactionOutputV1_1, NetworkInfo, UserResponse } from '@aptos-labs/wallet-standard';
import { ACDappClientConfig } from '@identity-connect/dapp-sdk';
import { AptosConnectAccount } from './AptosConnectAccount';
type WithSSOProvider<T> = T & {
    provider: 'google' | 'apple';
};
export interface AptosConnectWalletConfig extends Omit<ACDappClientConfig, 'defaultNetworkName' | 'provider'> {
    claimSecretKey?: HexInput;
    network?: Network;
    preferredWalletName?: string;
}
export declare abstract class AptosConnectWallet {
    protected static connectedAccountStorageKey: string;
    protected static get connectedAccount(): AccountInfo | undefined;
    protected static set connectedAccount(value: AccountInfo | undefined);
    readonly version = "1.0.0";
    readonly chains: readonly ["aptos:devnet", "aptos:testnet", "aptos:localnet", "aptos:mainnet"];
    get accounts(): AptosConnectAccount[];
    private readonly aptosClient;
    private readonly client;
    private readonly preferredWalletName?;
    private readonly claimOptions?;
    constructor({ claimSecretKey, network, preferredWalletName, ...clientConfig }: WithSSOProvider<AptosConnectWalletConfig>);
    connect(): Promise<UserResponse<AccountInfo>>;
    disconnect(): Promise<void>;
    signIn(input: AptosSignInInput): Promise<UserResponse<AptosSignInOutput>>;
    getAccount(): Promise<AccountInfo>;
    getNetwork(): Promise<NetworkInfo>;
    signMessage(input: AptosSignMessageInput): Promise<UserResponse<AptosSignMessageOutput>>;
    signTransaction(rawTxn: AnyRawTransaction): Promise<UserResponse<AccountAuthenticator>>;
    signTransaction(args: AptosSignTransactionInputV1_1): Promise<UserResponse<AptosSignTransactionOutputV1_1>>;
    signAndSubmitTransaction(args: AptosSignAndSubmitTransactionInput): Promise<UserResponse<AptosSignAndSubmitTransactionOutput>>;
    onAccountChange(_callback?: (newAccount: AccountInfo) => void): Promise<void>;
    onNetworkChange(_callback?: (newNetwork: NetworkInfo) => void): Promise<void>;
}
export {};
//# sourceMappingURL=AptosConnectWallet.d.ts.map