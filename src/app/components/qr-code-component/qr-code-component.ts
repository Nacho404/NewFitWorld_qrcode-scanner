import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VerifyQRCodeScope, VerifyQRCodeRequestData } from 'src/app/models/qrcode.model';
import { QRcodeService } from 'src/app/services/qrcode.service';
import { ResponseService } from 'src/app/services/response.service';
import { InformationMessageDialog } from '../informational-message-dialog/informational-message-dialog';

@Component({
  selector: 'qr-code-component',
  templateUrl: './qr-code-component.html',
  styleUrls: ['./qr-code-component.scss']
})
export class QrCodeComponent implements OnInit{
  subscriptionRxjs: Subscription = new Subscription;
  title = 'fitness-center-qrcode-scanner';
  @ViewChild("action", {static : true}) qrcodeComponent: NgxScannerQrcodeComponent | undefined;
  qrcodeData: any;

  anOptionIsSelected: boolean = false;
  qrcodeIsScanned: boolean = false;
  configurationIsSelected: boolean = true;

  entryBtnIsClicked = false;
  exitBtnIsClicked = false;
  headerText = '';

  selectedLocationIdentifyer: string | null = null;
  selectedCityName: string | null = null;

  locationsList: string[] = [];
  citiesList: string[] = [];

  locationFormControl = new FormControl(this.selectedLocationIdentifyer, [Validators.required]);
  cityFormControl = new FormControl(this.selectedCityName, [Validators.required]);
  
  qrcodeRequestScope: VerifyQRCodeScope = VerifyQRCodeScope.Entry;

  constructor (private qrcodeService: QRcodeService, private dialog: MatDialog, private responseService: ResponseService) {}

  ngOnInit(): void {
    this.getCitiesNames();
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

      if(qrcodeDataJSONformat?.locationIdentifyer != this.selectedLocationIdentifyer) {
        const errorDisplayed = `QR-code-ul scanat aparține de locația ${qrcodeDataJSONformat?.locationIdentifyer}, iar locația în care vă aflați este ${this.selectedLocationIdentifyer}. Este perims accesul în sală doar cliențiilor înregistrați pe locația: ${qrcodeDataJSONformat?.locationIdentifyer}`
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

  // Logic of configuration

  onLocationChange(event: any) {
    this.selectedLocationIdentifyer = event.value;
  }
  
  onCityChange(event: any) {
    this.selectedCityName = event.value;
    this.selectedLocationIdentifyer = null;
    this.getLocationsIdentifyers()
  }

  onSubmit(event: any) {
    if(!this.locationFormControl.valid || !this.cityFormControl.valid){
      return;
    }
    
    this.configurationIsSelected = false;
  }

  reconfigureScanner() {
    this.configurationIsSelected = true;
  }

  getCitiesNames() {
    if(this.subscriptionRxjs) {
      this.subscriptionRxjs.unsubscribe();
    }

    this.subscriptionRxjs = this.qrcodeService.getAllCities().subscribe(resp => this.citiesList = resp);
  }

  getLocationsIdentifyers() {
    if(this.subscriptionRxjs) {
      this.subscriptionRxjs.unsubscribe();
    }

    this.subscriptionRxjs = this.qrcodeService.getAllLocations(this.selectedCityName).subscribe(resp => this.locationsList = resp);
  }
}
