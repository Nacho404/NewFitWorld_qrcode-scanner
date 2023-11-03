import { Subject } from "rxjs";
import { UserDataToken } from "../models/user.model";
import { CookieService } from "ngx-cookie-service";
import { JwtHelperService } from "@auth0/angular-jwt";

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
    }
  
    eraseUserIdFromStore() {
      this.cookieService.set('userId', '');
    }
  
    getLocationIdFromStore() {
      return this.cookieService.get('locationId');
    }
  
    updateLocationIdFromStore(locationId: any) {
      this.cookieService.set('locationId', locationId);
    }
  
    eraseLocationIdFromStore() {
      this.cookieService.set('locationId', '');
    }
  
    updateTokenFromStore(tokenValue: any) {
      this.cookieService.set('token', tokenValue);
    }
  
    eraseTokenFromStore() {
      this.cookieService.set('token', '');
    }
  
    getTokenValue() {
        return this.cookieService.get('token');
    }
}