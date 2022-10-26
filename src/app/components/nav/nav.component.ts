import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter: number = 0;
  profile: User | null = null;


  constructor(
    private storeService: StoreService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    })
  }

  toggleMenu(){
    this.activeMenu = !this.activeMenu;
  }

  login(){
    this.authService.loginAndGet('sebas@mail.com', '1212')
    .subscribe(user => {
      this.profile= user;
    })
  }

}
