import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CanActivate, Router } from "@angular/router";
import { TokenService } from "./token.service";

@Injectable()
export class  AuthGuardService implements CanActivate {

    constructor(private tokenService: TokenService, private router: Router, private _snackBar: MatSnackBar) {}

    canActivate(): boolean {
        if(this.tokenService.userIsLoggedIn()){
            this.router.navigate(['/', 'qrcode']);

            this._snackBar.open("Ești deja autentificat în cont.",  '', 
            {
                duration: 5000,
            });

            return false;
        }
        return true;
    }
}