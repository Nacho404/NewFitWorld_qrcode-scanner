import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { Subscription } from 'rxjs';
import { VerifyQRCodeScope, VerifyQRCodeRequestData } from 'src/app/models/qrcode.model';
import { QRcodeService } from 'src/app/services/qrcode.service';
import { ResponseService } from 'src/app/services/response.service';
import { InformationMessageDialog } from '../informational-message-dialog/informational-message-dialog';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'qr-code-component',
  templateUrl: './qr-code-component.html',
  styleUrls: ['./qr-code-component.scss']
})
export class QrCodeComponent implements OnInit{
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

  constructor (private qrcodeService: QRcodeService, 
    private dialog: MatDialog, 
    private responseService: ResponseService,
    private tokenService: TokenService) {}

  ngOnInit(): void {
    this.locationIdentifyer = this.tokenService.getLocationIdentifyerFromStore();
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

      if(qrcodeDataJSONformat?.locationIdentifyer != this.locationIdentifyer) {
        const errorDisplayed = `QR-code-ul scanat aparține de locația ${qrcodeDataJSONformat?.locationIdentifyer}, iar locația în care vă aflați este ${this.locationIdentifyer}. Este perims accesul în sală doar cliențiilor înregistrați pe locația: ${qrcodeDataJSONformat?.locationIdentifyer}`
        this.dialog.open(InformationMessageDialog, { disableClose: true, data: {message: errorDisplayed, isSuccesfull: false}});
        return;
      }

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
