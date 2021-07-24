import { Injectable } from '@angular/core';
import {NavController } from '@ionic/angular';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthTokenService implements CanActivate{
  constructor(private router: Router,private navCtrl: NavController) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   
   if(JSON.parse(localStorage.getItem("token")) == null || JSON.parse(localStorage.getItem("token")) == undefined)
      {
        return true;
      }

      else
      {
        if(localStorage.getItem('pinstatus') == null || localStorage.getItem('pinstatus') == undefined)
        {
       

            this.router.navigate(['/enterpin']); 
            return false;


          
        } 
        else {
          
          this.router.navigate(['/submitpin']); 
          return false; 
        }
        
      }

}


    
}

