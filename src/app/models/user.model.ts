export interface UserDataToken {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface AccountCredetialsModel {
    email: string,
    password: string,
    scope: string
}

export interface SignInRequestResponse
{
    token: any,
    locationIdentifyer: string,
    failed: boolean,
    errorMessage: string,
    successMessage: string
}

export interface LogOutRequestResponse
{
    failed: boolean,
    errorMessage: string,
    successMessage: string
}

export enum SignInRequestScope {
    QRcodeApplication = 'QRcodeApplication',
    FitnessCenterApplication = 'FitnessCenterApplication'
}