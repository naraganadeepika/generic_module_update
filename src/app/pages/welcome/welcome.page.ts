import { Component, OnInit } from '@angular/core';
import {  MenuController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage  {

  constructor(
    
    private network: Network,
    private router: Router,
   public menu: MenuController
   ) { 

    

    
}

  //side menu disable before login

ionViewDidEnter() {

  
  this.network.onDisconnect().subscribe(() => {
      this.router.navigateByUrl('/network-error');
      return;
    })
    this.menu.enable(false);

  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }
  

    
}
