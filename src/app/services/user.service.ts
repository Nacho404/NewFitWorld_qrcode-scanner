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
        return this.http.post<SignInRequestResponse>(configUrl + '/login', userCredetials);
    }

    logOut(id: string | undefined){
        let configUrl = this.getFullAPIurl();
        return this.http.post<LogOutRequestResponse>(configUrl + '/logout' + `/${id}`, []);
    }

    // getDataFromUser(userId: string) {
    //     let configUrl = this.getFullAPIurl();
    //     return this.http.get<GetDataFromUserRequestResponse>(configUrl + `/getDataFromUser/${userId}`);
    // }

    getFullAPIurl(): string {
        return this.appComponentService.getAPIurl(UrlTargetTypes.USER);
    }

}