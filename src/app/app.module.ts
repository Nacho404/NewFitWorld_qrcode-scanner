import { BrowserModule } from '@angular/platform-browser';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InformationMessageDialog } from './components/informational-message-dialog/informational-message-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { QrCodeComponent } from './components/qr-code-component/qr-code-component';
import { Interceptor } from './services/interceptor';
import { SignInComponent } from './components/sign-in/sign-in-component';
import { RouterModule } from '@angular/router';
import { NotAuthGuardService } from './services/not-auth-guard.service';
import { AuthGuardService } from './services/auth-guard.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header';
import {MatProgressBarModule} from '@angular/material/progress-bar';


@NgModule({
  declarations: [
    AppComponent,
    InformationMessageDialog,
    QrCodeComponent,
    SignInComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      // { path: '', component: QrCodeComponent, canActivate: [NotAuthGuardService] },
      { path: 'qrcode-usermode', component: QrCodeComponent, canActivate: [NotAuthGuardService] },
      { path: 'qrcode-customermode', component: QrCodeComponent, canActivate: [NotAuthGuardService] },
      { path: 'signin', component: SignInComponent, canActivate: [AuthGuardService] }
    ]),
    NgxScannerQrcodeModule,
    HttpClientModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressBarModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }, AuthGuardService, NotAuthGuardService],
  bootstrap: [AppComponent],
})
export class AppModule { }
