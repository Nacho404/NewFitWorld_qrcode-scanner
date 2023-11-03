import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CanActivate, Router } from "@angular/router";
import { TokenService } from "./token.service";


@Injectable()
export class  NotAuthGuardService implements CanActivate {

    constructor(private tokenService: TokenService, private router: Router, private _snackBar: MatSnackBar) {}

    canActivate(): boolean {
        if(!this.tokenService.userIsLoggedIn()){
            this.tokenService.eraseTokenFromStore();
            this.router.navigate(['/', 'signin']);

            this._snackBar.open("Intră în cont inainte de a folosii sistemul.",  'Am Înteles', 
            {
                duration: 5000,
            });

            return false;
        }
        return true;
    }
}