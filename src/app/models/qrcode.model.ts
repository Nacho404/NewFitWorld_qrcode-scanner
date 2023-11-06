export interface VerifyQRCodeRequestData {
    customerId: string;
    locationIdentifyer: string;
    verifyQRCodeScope: VerifyQRCodeScope
}

export enum VerifyQRCodeScope {
    Entry = 'Entry',
    Exit = 'Exit'
}

export interface QRcodeRequestResponse {
    failed: boolean,
    errorMessage: string,
    successMessage: string
}

export enum QRcodeURLending {
    QRcodeCustomerMode = '/qrcode-customermode',
    QRcodeUserMode = '/qrcode-usermode'
}