import { SigningScheme } from '@aptos-labs/ts-sdk';
import { AccountInfo, AptosWalletAccount } from '@aptos-labs/wallet-standard';
export declare class AptosConnectAccount implements AptosWalletAccount {
    #private;
    readonly chains: readonly ["aptos:devnet", "aptos:testnet", "aptos:localnet", "aptos:mainnet"];
    get address(): `0x${string}`;
    get publicKey(): Uint8Array;
    get signingScheme(): SigningScheme;
    readonly label?: string;
    readonly features: never[];
    constructor({ address, ansName, publicKey }: AccountInfo);
}
//# sourceMappingURL=AptosConnectAccount.d.ts.map