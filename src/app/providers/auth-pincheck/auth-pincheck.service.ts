import { Injectable } from '@angular/core';
import {NavController } from '@ionic/angular';
import { Router, CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthPincheckService implements CanActivate{
    constructor(private router: Router,private navCtrl: NavController,private activeRoute: ActivatedRoute,) {}
     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
           if(localStorage.getItem('pinstatus') == null || localStorage.getItem('pinstatus') == undefined)
            {
              
              return true;
              
            } 
            else {
          
              this.router.navigate(['/submitpin']); 
              return false;
               
            }
        }
}
