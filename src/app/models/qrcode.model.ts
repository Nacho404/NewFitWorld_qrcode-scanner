export interface VerifyQRCodeRequestData {
    customerId: string;
    locationIdentifyer: string;
    verifyQRCodeScope: VerifyQRCodeScope
}

export enum VerifyQRCodeScope {
    Entry = 'Entry',
    Exit = 'Exit'
}
