import { AddtransactionsPage } from '../pages/modals/addtransactions/addtransactions.page';
import { Component } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import {Router}  from '@angular/router'

//import { AdMobFreeInterstitialConfig, AdMobFree } from '@ionic-native/admob-free/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  visible: boolean;


  constructor(private modalCtrl: ModalController,private platform: Platform,public router: Router) {}


  async openAddTransactionModal()
  {
    if(this.platform.is("cordova"))
    {
      //this.showInterstitialAds();
    }

    const modal = await this.modalCtrl.create({
      component: AddtransactionsPage,
      backdropDismiss: true
    });

    return await modal.present();
  }

 


//   showInterstitialAds(){
//     let interstitialConfig: AdMobFreeInterstitialConfig = {
//         isTesting: false, // Remove in production
//         autoShow: true,
//         id: "ca-app-pub-2582975357316139/1582620736"
//     };
//     this.admobFree.interstitial.config(interstitialConfig);
//     this.admobFree.interstitial.prepare().then(() => {
//     }).catch(e => alert(e));
// }

}
