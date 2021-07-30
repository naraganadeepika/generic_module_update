import { Component, OnInit } from '@angular/core';
import { NavController,Platform } from '@ionic/angular';
import { isCordovaAvailable } from '../../providers/is-cordova-available'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  category:any = "day";
  gaugeLabel = "of $3824";
  gaugePrependText = "$"
  gaugeType = "arch";
  gaugeValue = 50.5;
 
  

  constructor(private navCtrl:NavController, private plt: Platform) { //local notifications
    }
  ngOnInit() {
     localStorage.removeItem('need_to_update_phone');
  }

  

}
