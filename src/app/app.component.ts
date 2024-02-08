import { Component, OnInit, enableProdMode } from '@angular/core';
import { TokenService } from './services/token.service';
import * as PackageJson from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userIsLoggedIn = false;
  applicationVersion =  PackageJson?.version;

  constructor(private tokenService: TokenService){}

  ngOnInit(): void {
    enableProdMode();
    this.setUserIsLoggedIn()
    this.tokenService.subject.subscribe(() => this.setUserIsLoggedIn());
  }

  setUserIsLoggedIn() {
    this.userIsLoggedIn = this.tokenService.userIsLoggedIn();
  }
}
