import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { VerifyQRCodeRequestData } from "../models/qrcode.model";
import { AppComponentService, UrlTargetTypes } from "./app.component.service";

@Injectable({
    providedIn: 'root'
})

export class QRcodeService {
    constructor (private http:  HttpClient, private appComponentService: AppComponentService) {}

    verifyQRcodeScanned(request: VerifyQRCodeRequestData) {
        let configUrl = this.getFullAPIurl();
        return this.http.post(configUrl + `/verifyQRcodeScanned`, request);
    }

    getAllCities() {
        let configUrl = this.getFullAPIurl();
        return this.http.get<string[]>(configUrl  + '/getCitiesNamesForQRcodeConfiguration');
    }

    getAllLocations(cityName: string | null) {
        let configUrl = this.getFullAPIurl();
        return this.http.get<string[]>(configUrl + `/getLocationsIdentifyersForQRcodeConfiguration/${cityName}`);
    }

    getFullAPIurl(): string {
        return this.appComponentService.getAPIurl(UrlTargetTypes.QRCODE);
    }
}