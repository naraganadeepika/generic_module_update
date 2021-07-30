import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../user/user.service';
import {NavController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
token_stor:any;
  constructor(public jwtHelper: JwtHelperService, public navCtrl: NavController, private router: Router,private user:UserService) {

 this.token_stor =localStorage.getItem('token');
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   if(localStorage.getItem('token') != null) {
     if (this.isAuthenticated()) { 
         // this.user.get_wallet_balance().subscribe((resp:any) => {
         //   this.user.username = localStorage.getItem('username');
         //   this.user.wallet_balance = resp.balance;
         //  }) 
         return true;      
       } else {
           if(localStorage.getItem('pinstatus') == null){
              this.navCtrl.navigateRoot('enterpin');
           } else {
             // alert('if aut');
            this.router.navigate(['submitpin'], { queryParams: { returnUrl: state.url }});
          }
            return false;
       }
    }else{
      if(localStorage.getItem('pinstatus') == null || localStorage.getItem('pinstatus') == undefined)
        {
          this.navCtrl.navigateRoot('/');
        }
      else{
        // alert('els aut');
        this.navCtrl.navigateForward('submitpin')
      }
    }


}

isAuthenticated(): boolean {

      this.token_stor = JSON.parse(localStorage.getItem("token"));
      if(this.token_stor != null && this.token_stor!= undefined ) {

        if(JSON.parse(localStorage.getItem('mobile_status')) == false)
                {
                    this.navCtrl.navigateRoot('verifyotp');
                }else{
                    return   !this.jwtHelper.isTokenExpired(this.token_stor);            
                }
      

      //this.router.navigate('/login')
      
      }else{
        if(localStorage.getItem('pinstatus') == null){
          this.navCtrl.navigateRoot('enterpin');     
    }else {
    this.navCtrl.navigateRoot('submitpin');
    }
        return false
      }
    }

    
}





  