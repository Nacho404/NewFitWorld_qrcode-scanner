import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TokenService } from "src/app/services/token.service";
import { UserService } from "src/app/services/user.service";
import { InformationMessageDialog } from "../informational-message-dialog/informational-message-dialog";
import { AccountCredetialsModel, SignInRequestResponse, SignInRequestScope } from "src/app/models/user.model";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'sign-in-component',
  templateUrl: './sign-in-component.html',
  styleUrls: ['./sign-in-component.scss']
})


export class SignInComponent implements OnInit {
  requestIsInProgress: boolean = false;

  emailFormControl  = new FormControl('', [Validators.required]);
  passwordFormControl  = new FormControl('', [Validators.required]);
  
  constructor(private userService: UserService, 
    private _snackBar: MatSnackBar,
    private router: Router,
    private tokenService: TokenService,
    private dialog: MatDialog
    ){}

  ngOnInit(): void {

  }

  onSubmit(event: any) {
    if(!this.emailFormControl.valid || !this.passwordFormControl.valid) return;

    this.requestIsInProgress = true;
    const userCredentials: AccountCredetialsModel = {
      email: event.target.email.value,
      password: event.target.password.value,
      scope: SignInRequestScope.QRcodeApplication
    }

    this.userService.signIn(userCredentials).subscribe({
      next: (res: SignInRequestResponse)=> {
        if(res.failed){
          this.dialog.open(InformationMessageDialog, { disableClose: true, data: {message: res.errorMessage}});
          this.requestIsInProgress = false;
          return;
        }

        this._snackBar.open(res.successMessage,  '', 
        {
          duration: 5000,
          panelClass:"successfully_sneak_bar"
        });
        
        this.tokenService.updateTokenFromStore(res.token.value);
        this.tokenService.updateUserIdFromStore(res.token.userId);
        this.tokenService.updateLocationIdentifyerFromStore(res.locationIdentifyer);
        this.router.navigate(['/qrcode-customermode']);
        this.requestIsInProgress = false;
      },
      error: (err: string) => {
        const errorInfoDialog = this.dialog.open(InformationMessageDialog, { disableClose: true, data: {message: err}});
        
        errorInfoDialog.afterClosed().subscribe(() => {
          this.requestIsInProgress = false;
        });
      }
    }); 
  }

}


