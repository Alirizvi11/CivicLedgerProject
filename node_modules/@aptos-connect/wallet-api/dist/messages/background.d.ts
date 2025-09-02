import { AptosWalletError } from '@aptos-labs/wallet-standard';
import { SerializedWalletRequest } from '../WalletRequest';
import { SerializedWalletResponse } from '../WalletResponse';
import { TypedMessage } from './common';
export declare class AptosWalletRequestMessage implements TypedMessage {
    nonce: string;
    serializedValue: SerializedWalletRequest;
    static readonly TYPE = "AptosWalletRequest";
    readonly __messageType = "AptosWalletRequest";
    constructor(nonce: string, serializedValue: SerializedWalletRequest);
}
export declare class AptosWalletSuccessResponseMessage implements TypedMessage {
    serializedValue: SerializedWalletResponse;
    nonce: string;
    static readonly TYPE = "AptosWalletSuccessResponseMessage";
    readonly __messageType = "AptosWalletSuccessResponseMessage";
    constructor(serializedValue: SerializedWalletResponse, nonce: string);
}
export declare class AptosWalletErrorResponseMessage implements TypedMessage {
    error: AptosWalletError;
    nonce: string;
    static readonly TYPE = "AptosWalletErrorResponseMessage";
    readonly __messageType = "AptosWalletErrorResponseMessage";
    constructor(error: AptosWalletError, nonce: string);
}
export type AptosWalletResponseMessage = AptosWalletSuccessResponseMessage | AptosWalletErrorResponseMessage;
export declare function isAptosWalletResponseMessage(message: any): message is AptosWalletResponseMessage;
//# sourceMappingURL=background.d.ts.map