import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-addtransactions',
  templateUrl: './addtransactions.page.html',
  styleUrls: ['./addtransactions.page.scss'],
})
export class AddtransactionsPage implements OnInit {
  requestType:string;
  constructor(private modalCtrl: ModalController,public navCtrl:NavController) { }
 
  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  goreqMoney()
  {
    this.setNavigation('request','request');
  }

  goSendMoney()
  {
    this.setNavigation('send','request');
  }

  goAddtransaction()
  {
    this.setNavigation('income','addincome');
  }

  setNavigation(param:string,url:string)  //navigate with parameters
  {

    this.dismiss();
    let navigationExtras: NavigationExtras = {
      queryParams: {
          type: param
      }
    };
    
    this.navCtrl.navigateForward([url],navigationExtras);
  }

}
