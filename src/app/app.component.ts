import { Component, ViewChild } from '@angular/core';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeService } from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fitness-center-qrcode-scanner';
  @ViewChild("action", {static : true}) qrcodeComponent: NgxScannerQrcodeComponent | undefined;
  qrcodeData: any;

  anOptionIsSelected: boolean = false;
  qrcodeIsScanned: boolean = false;

  onDataChange(event: any) {
    if(event[0]?.value && !this.qrcodeIsScanned) {
      this.qrcodeData = event[0].value;

      this.qrcodeComponent?.stop();
      this.qrcodeIsScanned = true;
    }
    this.qrcodeComponent?.stop();
  }

  public handle(action: any, fn: string): void {
    action[fn]().subscribe();
  }

  onEntryClick() {
    this.anOptionIsSelected = true;
    this.qrcodeComponent?.start();
  }

  onExitClick() {
    this.anOptionIsSelected = true;
    this.qrcodeComponent?.start();
  }
}
