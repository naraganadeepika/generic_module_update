import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { environment } from '../../../environments/environment';
import { isCordovaAvailable } from '../../providers/is-cordova-available'

import { UserService, ErrorService, ToastersService } from '../../providers';
import { LoadingController, AlertController } from '@ionic/angular';



@Component({
  selector: 'app-suspend-account',
  templateUrl: './suspend-account.page.html',
  styleUrls: ['./suspend-account.page.scss'],
})
export class SuspendAccountPage implements OnInit {

 // hide_countdown:boolean=true;
 lft_time:any;
 suspend_account:boolean;
  constructor(
    private alertCtrl:AlertController,
    public translate: TranslateService,
    private iab: InAppBrowser,
    public user:UserService,
    public errorService:ErrorService,
    public loadingCtrl: LoadingController,
    private toaster:ToastersService,
    ) 
  {
   }

  ngOnInit() {
    this.check_account();
  }
  async check_account()
  {
    const loading = await this.loadingCtrl.create({
       spinner: null,
      message: '',
    }); 
     loading.present();
    this.user.check_suspend_account().subscribe((resp:any) => {
      loading.dismiss(); 
      this.suspend_account=resp.suspend_account;
      this.lft_time=resp.time_left;
    },(err)=>{
      loading.dismiss();
      this.errorService.errorsMethod(err)
    })
  }

//open terms page via inpp browser

  view_tcs()
  {
    if(isCordovaAvailable())
        {
          const browser = this.iab.create(environment.web_path+'/terms-conditions','_blank', 'location=yes');
        }
        else
        {
          this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
        } 
  }
 //suspend your account for a while
 
  async suspend(type)
  {

    const alert = await this.alertCtrl.create({
      header: this.translate.instant('CONFIRM')+'!',
      message: this.translate.instant('SUSPEND_MSG_CONFIRM'),
      buttons: [
        {
          text: this.translate.instant('NO'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.translate.instant('YES'),
          handler: () => {

            // const loading = await this.loadingCtrl.create({
            //    spinner: null,
            //   message: '',
            // }); 
            //  loading.present();
            this.user.suspend_account(type).subscribe((resp:any) => {
              // loading.dismiss(); 
              // code4:For error messages and no data messages
              if(resp.code == 4)
              {
                this.user.presentfailAlert(this.translate.instant(resp),'<ion-img src="assets/imgs/warning.png">');
                return false;
              }
              this.user.presentsuccessAlert(this.translate.instant(resp.message))
              this.check_account();
            },(err)=>{
              // loading.dismiss();
              this.errorService.errorsMethod(err)
            })
          }

          }]
        })
    await alert.present();




    
  }
  

}
