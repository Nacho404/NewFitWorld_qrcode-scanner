import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { TokenService } from "src/app/services/token.service";
import { UserService } from "src/app/services/user.service";
import { InformationMessageDialog } from "../informational-message-dialog/informational-message-dialog";
import { CookieService } from "ngx-cookie-service";
import { LogOutRequestResponse, UserDataToken } from "src/app/models/user.model";

@Component({
    selector: 'header',
    templateUrl: './header.html',
    styleUrls: ['./header.scss']
})
  
export class HeaderComponent implements OnInit {
  helper = new JwtHelperService();
  userIsLoggedIn = false;
  userId: string = '';
  accountRole: string = '';
  userDataToken: UserDataToken;
  locationAssignedToUser: any | null = null; // Here should be LocationModel

  tokenValue: string;

  constructor(
    private tokenService: TokenService,
    private userService: UserService, 
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cookieService: CookieService){
      this.tokenValue = this.cookieService.get('token');
    }

  ngOnInit(): void {
    this.getAccountTokenData();
    this.setUserIsLoggedIn()
    this.userId = this.tokenService.getUserIdFromStore();
    if(this.userIsLoggedIn) {
      this.getUserLocationAssigned();
    }
    
    this.tokenService.subject.subscribe(() => {
      this.getAccountTokenData();
      this.setUserIsLoggedIn();
      this.userId = this.tokenService.getUserIdFromStore();

      if(this.userIsLoggedIn) {
        this.getUserLocationAssigned();
      }

    });
  }

  getAccountTokenData() {
    this.userDataToken =  this.tokenService.getUserData();
  }

  setUserIsLoggedIn() {
    this.userIsLoggedIn = this.tokenService.userIsLoggedIn();
  }

  getUserLocationAssigned() {
    // if(this.userId != '') {
      
    //   this.userService.getDataFromUser(this.userId).subscribe({
    //     next: (res: GetDataFromUserRequestResponse) => {

    //       if(res.failed){
    //         this.dialog.open(InformationMessageDialog, { disableClose: true, data: {message: res.errorMessage}});
    //       }
  
    //       this.locationAssignedToUser = res.userLocationAssigned;
    //       this.tokenService.updateLocationIdFromStore(res.userLocationAssigned?.id);
    //     },
    //     error: (err: string) => {
    //       this.dialog.open(InformationMessageDialog, { disableClose: true, data: {message: err}});
    //     }
    //   });
    // }
  }

  signOut() {
    this.userService.logOut(this.userId).subscribe({
      next: (res: LogOutRequestResponse)=> {
        if(res.failed){
          this.dialog.open(InformationMessageDialog, { disableClose: true, data: {message: res.errorMessage}});

          return;
        }
        
        this._snackBar.open(res.successMessage,  '', 
        {
          duration: 5000,
          panelClass:"successfully_sneak_bar"
        });
        
        this.tokenService.eraseTokenFromStore();
        this.tokenService.eraseUserIdFromStore();
        this.tokenService.eraseLocationIdFromStore();
        this.router.navigate(['/', 'signin']);
        this.locationAssignedToUser = null;
      },
      error: (err: string) => {
        this.dialog.open(InformationMessageDialog, { disableClose: true, data: {message: err}});
      }
    });
  }
}