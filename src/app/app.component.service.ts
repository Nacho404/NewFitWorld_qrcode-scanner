import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AppComponentService {
    constructor (private http:  HttpClient) {}

    configUrl = 'https://localhost:7154/Location';
    
    getAllCities() {
        return this.http.get<string[]>(this.configUrl  + '/getCitiesNamesForQRcodeConfiguration');
    }

    getAllLocations(cityName: string) {
        return this.http.get<string[]>(this.configUrl + `/getLocationsIdentifyersForQRcodeConfiguration/${cityName}`);
    }
}
