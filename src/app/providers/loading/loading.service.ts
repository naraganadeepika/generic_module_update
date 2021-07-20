import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
	loading:any;
  constructor(public loadingController: LoadingController) { }

  async presentLoading() {
  	this.loading = await this.loadingController.create({
      spinner: null,
      // message: msg,
      translucent: true,
      cssClass: 'custom-loading',
      backdropDismiss: false
    });
    await this.loading.present();
  }
  dismissLoading(){
  	this.loading.dismiss()
  }

}
