import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppComponentService, UrlTargetTypes } from "./app.component.service";
import { AccountCredetialsModel, LogOutRequestResponse, SignInRequestResponse } from "../models/user.model";

@Injectable({
    providedIn: 'root'
  })
export class UserService {

    constructor (private http:  HttpClient, private appComponentService: AppComponentService) {}

    signIn(userCredetials: AccountCredetialsModel){
        let configUrl = this.getFullAPIurl();
        return this.http.post<SignInRequestResponse>(configUrl + '/signIn', userCredetials);
    }

    logOut(id: string | undefined){
        let configUrl = this.getFullAPIurl();
        return this.http.post<LogOutRequestResponse>(configUrl + '/signOut' + `/${id}`, []);
    }
    
    getFullAPIurl(): string {
        return this.appComponentService.getAPIurl(UrlTargetTypes.USER);
    }

}