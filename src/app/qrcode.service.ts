import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { VerifyQRCodeRequestData } from "./qrcode.model";

@Injectable({
    providedIn: 'root'
})

export class QRcodeService {
    constructor (private http:  HttpClient) {}

    configUrl = 'https://localhost:7154/QRCode';

    verifyQRcodeScanned(request: VerifyQRCodeRequestData) {
        return this.http.post(this.configUrl + `/verifyQRcodeScanned`, request);
    }

    getAllCities() {
        return this.http.get<string[]>(this.configUrl  + '/getCitiesNamesForQRcodeConfiguration');
    }

    getAllLocations(cityName: string | null) {
        return this.http.get<string[]>(this.configUrl + `/getLocationsIdentifyersForQRcodeConfiguration/${cityName}`);
    }
}