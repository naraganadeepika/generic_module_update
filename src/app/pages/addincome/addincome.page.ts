import { Component, OnInit } from '@angular/core';
import { SuccessmodalPage } from '../modals/successmodal/successmodal.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-addincome',
  templateUrl: './addincome.page.html',
  styleUrls: ['./addincome.page.scss'],
})
export class AddincomePage implements OnInit {
  unit:any;
  constructor( private modalCtrl:ModalController) { 
    this.unit = '$'
  }

  ngOnInit() {
  }

  async showSuccess()
  {
    const modal = await this.modalCtrl.create({
      component: SuccessmodalPage,
      backdropDismiss: true
    });

    return await modal.present();
  }

}
