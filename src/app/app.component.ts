import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { InformationMessageDialog } from './informational-message-dialog/informational-message-dialog';
import { VerifyQRCodeRequestData, VerifyQRCodeScope } from './qrcode.model';
import { QRcodeService } from './qrcode.service';
import { ResponseService } from './response.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'fitness-center-qrcode-scanner';
  @ViewChild("action", {static : true}) qrcodeComponent: NgxScannerQrcodeComponent | undefined;
  qrcodeData: any;

  anOptionIsSelected: boolean = false;
  qrcodeIsScanned: boolean = false;

  entryBtnIsClicked = false;
  exitBtnIsClicked = false;

  qrcodeRequestScope: VerifyQRCodeScope = VerifyQRCodeScope.Entry;

  constructor (private qrcodeService: QRcodeService, private dialog: MatDialog, private responseService: ResponseService) {}

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
        locationIdentifyer: qrcodeDataJSONformat?.locationIdentifyer,
        verifyQRCodeScope: this.qrcodeRequestScope
      }

      this.qrcodeService.verifyQRcodeScanned(requestData).subscribe({
        next: () => {
          let errorDisplayed = "";
          if(this.qrcodeRequestScope == VerifyQRCodeScope.Entry){
            errorDisplayed = "Cod QR scanat cu succes. Bine ai venit la NewFitWorld. Rămâi mereu în formă.";
          }

          if(this.qrcodeRequestScope == VerifyQRCodeScope.Exit){
            errorDisplayed = "Cod QR scanat cu succes. Îți mulțumim că ai ales să te antrenezi alături de noi.";
          }

          const infoDialog = this.dialog.open(InformationMessageDialog, { disableClose: true, data: {message: errorDisplayed, isSuccesfull: true}});

          infoDialog.afterClosed().subscribe(() => {
            this.resetBooleansDeclared();
          })
        },
        error: (err) => {
          const errorDisplayed = this.responseService.manageErrorResponse(err);
          const infoDialog = this.dialog.open(InformationMessageDialog, { disableClose: true, data: {message: errorDisplayed, isSuccesfull: false}});

          infoDialog.afterClosed().subscribe(() => {
            this.resetBooleansDeclared();
          })
        }
      })
      this.resetBooleansDeclared();
    }
    this.qrcodeComponent?.stop();
  }

  public handle(action: any, fn: string): void {
    action[fn]().subscribe();
  }

  onEntryClick() {
    this.anOptionIsSelected = true;
    this.entryBtnIsClicked = true;
    this.qrcodeComponent?.start();
  }

  onExitClick() {
    this.anOptionIsSelected = true;
    this.exitBtnIsClicked = true;
    this.qrcodeComponent?.start();
  }

  resetBooleansDeclared() {
    this.qrcodeIsScanned = false;
    this.anOptionIsSelected = false;
    this.exitBtnIsClicked = false;
    this.entryBtnIsClicked = false;

  }
}
