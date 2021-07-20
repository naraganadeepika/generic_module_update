import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { LoadingController} from '@ionic/angular';
import { Platform,IonRouterOutlet } from '@ionic/angular';


@Component({
  selector: 'app-network-error',
  templateUrl: './network-error.page.html',
  styleUrls: ['./network-error.page.scss'],
})
export class NetworkErrorPage implements OnInit {

constructor(private network: Network,public loadingCtrl:LoadingController,private platform: Platform,) { 
  	this.loading_fun();
  }

  ngOnInit() {
  }
  async loading_fun(){
  	const loading = await this.loadingCtrl.create({
	       spinner: null,
	      message: '',
	    });
  	loading.present();
  	this.platform.backButton.subscribe(() => {
  		 navigator['app'].exitApp();
  	});	    
  	this.network.onConnect().subscribe(() => {  		
  		window.location.href = "";
  		loading.dismiss();
  	})
  }
}
