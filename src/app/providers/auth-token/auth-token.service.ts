import { Injectable } from '@angular/core';
import {NavController } from '@ionic/angular';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthTokenService implements CanActivate{
  constructor(private router: Router,private navCtrl: NavController) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   if(localStorage.getItem('token') != null) {
      if(localStorage.getItem('pinstatus') == null){
            this.navCtrl.navigateRoot('enterpin');
        }else {
    		this.navCtrl.navigateRoot('submitpin');
    	}
      return false;
    }else{
    	return true;
    }
}


    
}

