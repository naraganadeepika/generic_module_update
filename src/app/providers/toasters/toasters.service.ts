import { Injectable } from '@angular/core';
import { ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastersService {
	tst_msg:any='';
	element_toast:any;
  constructor(public toastCtrl:ToastController) { }

  async presentToast(msg) {
	const toast = await this.toastCtrl.create({
	     message: msg,
	     position: 'top',
	     duration: 5000,
	     cssClass:'toaster_alert',
	     buttons: ['X']
	   });
	    this.tst_msg = msg;
	    toast.onDidDismiss()
	     .then((data) => {
	         this.tst_msg = '';
	     });
	  toast.present();  
	}

	async error_presentToast(msg) {
	const toast = await this.toastCtrl.create({
	     message: msg,
	     position: 'top',
	     duration: 5000,
	     cssClass:'error_toaster_alert',
	     buttons: ['X']
	   });
	    this.tst_msg = msg;
	    toast.onDidDismiss()
	     .then((data) => {
	         this.tst_msg = '';
	     });
	  toast.present();  
	}

	async warning_presentToast(msg) {
	const toast = await this.toastCtrl.create({
	     message: msg,
	     position: 'top',
	     duration: 5000,
	     cssClass:'warning_toaster_alert',
	     buttons: ['X']
	   });
		this.tst_msg = msg; 
	    toast.onDidDismiss()
	     .then((data) => {
	         this.tst_msg = '';
	     });
	  toast.present();  
	}

	async success_presentToast(msg) {
	const toast = await this.toastCtrl.create({
	     message: msg,
	     position: 'top',
	     duration: 5000,
	     cssClass:'success_toaster_alert',
	     buttons: ['X']
	   });
	    this.tst_msg = msg;
	    toast.onDidDismiss()
	     .then((data) => {
	         this.tst_msg = '';
	     });
	  toast.present();  
	}

}
