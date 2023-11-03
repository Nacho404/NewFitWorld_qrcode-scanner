import { Subject } from "rxjs";
import { UserDataToken } from "../models/user.model";
import { CookieService } from "ngx-cookie-service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class TokenService {
    tokenValue: string = '';
    userId: string = '';
    locationId: string = '';
  
    public subject = new Subject<void>();
    private helper = new JwtHelperService();
  
    userDataToken: UserDataToken = {
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      role: ""
    }
    
    constructor (private cookieService: CookieService) {
      this.tokenValue = this.cookieService.get('token');
    }
  
  
    userIsLoggedIn = () => {
      const tokenExpired = this.helper.isTokenExpired(this.cookieService.get('token'));

      if(tokenExpired){
        this.cookieService.set('token', '')
      }

      return tokenExpired? false : true;
    };
    
    getUserData() {
      const decodedToken = this.helper.decodeToken(this.cookieService.get('token'));

      if(decodedToken != null) {
        this.userDataToken.userId = decodedToken.nameId;
        this.userDataToken.firstName = decodedToken.given_name;
        this.userDataToken.lastName = decodedToken.family_name;
        this.userDataToken.email = decodedToken.email;
        this.userDataToken.role = decodedToken.role;
      }
      
      return this.userDataToken;
    }

    getUserIdFromStore() {
      return this.cookieService.get('userId');
    }
  
    updateUserIdFromStore(userId: any) {
      this.cookieService.set('userId', userId);
      this.subject.next();
    }
  
    eraseUserIdFromStore() {
      this.cookieService.set('userId', '');
      this.subject.next();
    }
  
    getLocationIdentifyerFromStore() {
      return this.cookieService.get('locationIdentifyer');
    }
  
    updateLocationIdentifyerFromStore(identifyer: any) {
      this.cookieService.set('locationIdentifyer', identifyer);
    }
  
    eraseLocationIdentifyerFromStore() {
      this.cookieService.set('locationIdentifyer', '');
      this.subject.next();
    }
  
    updateTokenFromStore(tokenValue: any) {
      this.cookieService.set('token', tokenValue);
      this.subject.next();
    }
  
    eraseTokenFromStore() {
      this.cookieService.set('token', '');
      this.subject.next();
    }
  
    getTokenValue() {
      return this.cookieService.get('token');
    }
}