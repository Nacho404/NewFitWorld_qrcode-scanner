import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { Subscription } from 'rxjs';
import { VerifyQRCodeScope, VerifyQRCodeRequestData, QRcodeRequestResponse, QRcodeURLending } from 'src/app/models/qrcode.model';
import { QRcodeService } from 'src/app/services/qrcode.service';
import { InformationMessageDialog } from '../informational-message-dialog/informational-message-dialog';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'qr-code-component',
  templateUrl: './qr-code-component.html',
  styleUrls: ['./qr-code-component.scss']
})
export class QrCodeComponent implements OnInit{
  requestIsInProgress: boolean = false;

  subscriptionRxjs: Subscription = new Subscription;
  @ViewChild("action", {static : true}) qrcodeComponent: NgxScannerQrcodeComponent | undefined;
  qrcodeData: any;

  anOptionIsSelected: boolean = false;
  qrcodeIsScanned: boolean = false;

  entryBtnIsClicked = false;
  exitBtnIsClicked = false;
  headerText = '';

  locationIdentifyer: string;

  locationsList: string[] = [];
  citiesList: string[] = [];

  qrcodeRequestScope: VerifyQRCodeScope = VerifyQRCodeScope.Entry;
  currentURLending = '';
  isCustomerMode = false;

  constructor (private qrcodeService: QRcodeService, 
    private dialog: MatDialog, 
    private tokenService: TokenService,
    private router: Router) {}

  ngOnInit(): void {
    this.locationIdentifyer = this.tokenService.getLocationIdentifyerFromStore();
    this.currentURLending = this.router.url;
    
    if(this.currentURLending == '/') {
      this.router.navigate(['/', 'qrcode-customermode']);
    }

    if(this.currentURLending == QRcodeURLending.QRcodeCustomerMode) {
      this.isCustomerMode = true;
    } else {
      this.isCustomerMode = false;
    }
  }

  onDataChange(event: any) {
    if(event[0]?.value && !this.qrcodeIsScanned) {
      this.qrcodeData = event[0].value;

      this.qrcodeComponent?.stop();
      this.qrcodeIsScanned = true;

      if(this.entryBtnIsClicked) { 
        this.qrcodeRequestScope = VerifyQRCodeScope.Entry;
      }

      if(this.exitBtnIsClicked) { 
        this.qrcodeRequestScope = VerifyQRCodeScope.Exit;
      }

      const qrcodeDataJSONformat = JSON.parse(this.qrcodeData);

      const requestData: VerifyQRCodeRequestData = {
        customerId: qrcodeDataJSONformat?.customerId,
        locationIdentifyer: this.locationIdentifyer,
        verifyQRCodeScope: this.qrcodeRequestScope
      }

      this.requestIsInProgress = true;
      this.qrcodeService.verifyQRcodeScanned(requestData).subscribe({
      next: (res: QRcodeRequestResponse) => {

        if (res.failed) {
          const infoDialog = this.dialog.open(InformationMessageDialog, { disableClose: true, data: {message: res.errorMessage, isSuccesfull: false}});
          infoDialog.afterClosed().subscribe(() => {
            this.resetBooleansDeclared();
            this.requestIsInProgress = false;
          });
          return;
        }

        const infoDialog = this.dialog.open(InformationMessageDialog, { disableClose: true, data: {message: res.successMessage, isSuccesfull: true}});
        infoDialog.afterClosed().subscribe(() => {
          this.resetBooleansDeclared();
          this.requestIsInProgress = false;
        });
      },
      error: (err: string) => {
        const infoDialog = this.dialog.open(InformationMessageDialog, { disableClose: true, data: {message: err, isSuccesfull: false}});
        infoDialog.afterClosed().subscribe(() => {
          this.resetBooleansDeclared();
          this.requestIsInProgress = false;
        });
      }
      })
      this.resetBooleansDeclared();
    }
    
    // This approach is used for preventing an Infinite loop of scanning the QRcode
    if(event.data){
      this.qrcodeComponent?.stop();
    }
  }

  public handle(action: any, fn: string): void {
    action[fn]().subscribe();
  }

  onEntryClick() {
    this.headerText = 'Intrare în centrul fitness';
    this.anOptionIsSelected = true;
    this.entryBtnIsClicked = true;
    this.qrcodeComponent?.start();
  }

  onExitClick() {
    this.headerText = 'Ieșire din centrul fitness';
    this.anOptionIsSelected = true;
    this.exitBtnIsClicked = true;
    this.qrcodeComponent?.start();
  }

  resetBooleansDeclared() {
    this.headerText = '';
    this.qrcodeIsScanned = false;
    this.anOptionIsSelected = false;
    this.exitBtnIsClicked = false;
    this.entryBtnIsClicked = false;
  }

  backToMenu() {
    this.qrcodeComponent?.stop();
    this.resetBooleansDeclared();
  }
}
