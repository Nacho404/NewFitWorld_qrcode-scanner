import { Injectable, isDevMode } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AppComponentService {
    public getAPIurl(urlTarget: string =  ''): string {
        if(isDevMode()) {
            const apiURL = 'https://localhost:7154' + urlTarget;
            return apiURL;
        } else {
            const apiURL = 'https://fitnesscenter-server-api.azurewebsites.net' + urlTarget;
            return apiURL;
        }
    }
}

export enum UrlTargetTypes {
    QRCODE = '/QRCode',
}