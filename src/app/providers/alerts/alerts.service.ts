import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  last_msg:any;
  alert:any;
  constructor(private alertController: AlertController,public translate: TranslateService,) { }

  async presentAlert(data:any){
    var img;
    if(data.img == 'server_not_found'){
      img = '<ion-img src="assets/images/server_not_found.png"></ion-img>';
    }else if(data.img == 'error'){
      img = '<ion-img src="assets/images/X-mark.png"></ion-img>';
    }else if(data.img == 'warning'){
      img = '<ion-img src="assets/images/warning.png"></ion-img>';
    }
    else if(data.img == 'internal'){
      img = '<ion-img src="assets/images/internal.png"></ion-img>';
    }
    else if(data.img == 'user_not_found'){
      img = '<ion-img src="assets/images/user_not_found.png"></ion-img>';
    }
    else if(data.img == 'success'){
      img = '<ion-img src="assets/images/right_mark.gif"></ion-img>';
    }
    else if(data.img == 'pending'){
      img = '<ion-img src="assets/images/ant_loading_profile.gif"></ion-img>';
    }
    this.alert = await this.alertController.create({
      header: data.header,
      subHeader: data.message,
      message: img,
      backdropDismiss:false,
      cssClass:'custom_alert_class',
      buttons:[this.translate.instant('OK_BUTTON')]
    });
    await this.alert.present();

  }
  async confirmAlert(data:any){
    this.alert = await this.alertController.create({
      header: data.header,
      subHeader: data.subheader,
      message: data.message,
      backdropDismiss:false,
      buttons: [
        {
          text: this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            return false;
          }
        }, {
          text: this.translate.instant('YES'),
          handler: () => {
            return true;
          }
        }
      ]
    });
    await this.alert.present();
  }
}
