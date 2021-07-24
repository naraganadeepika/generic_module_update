import { Component, OnInit } from '@angular/core';
import {  MenuController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage  implements OnInit{
slideOpts={
    autoplay:true,
    loop:true
  }
  constructor(private navCtrl:NavController) { }

  //side menu disable before login

ngOnInit() {
  }

  goLogin()
  {
    this.navCtrl.navigateRoot('login');
  }

  goSignup()
  {
    this.navCtrl.navigateRoot('signup');
  }
  

    
}
