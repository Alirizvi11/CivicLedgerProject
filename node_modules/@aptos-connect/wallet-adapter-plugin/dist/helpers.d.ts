import { AccountInfo as ACAccountInfo, UserResponse as ACUserResponse } from '@aptos-connect/wallet-api';
import { Network } from '@aptos-labs/ts-sdk';
import { AccountInfo, UserResponse } from '@aptos-labs/wallet-standard';
export declare function customAccountToStandardAccount({ address, name, publicKey }: ACAccountInfo): AccountInfo;
export declare function unwrapUserResponse<T, U>(response: ACUserResponse<T>, callback: (args: T) => U): UserResponse<U>;
export declare function networkToChainId(network: Network): number;
//# sourceMappingURL=helpers.d.ts.map