import { Component, OnInit, enableProdMode } from '@angular/core';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userIsLoggedIn = false;

  constructor(private tokenService: TokenService){}

  ngOnInit(): void {
    // enableProdMode();
    this.setUserIsLoggedIn()
    this.tokenService.subject.subscribe(() => this.setUserIsLoggedIn());
  }

  setUserIsLoggedIn() {
    this.userIsLoggedIn = this.tokenService.userIsLoggedIn();
  }
}
