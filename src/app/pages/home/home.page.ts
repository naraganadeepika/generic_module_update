import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

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
 
  

  constructor(private navCtrl:NavController) { }

  ngOnInit() {
     localStorage.removeItem('need_to_update_phone');
  }

  segmentChanged(ev: any) {
    this.category = ev.detail.value;
    console.log(this.category);
  }

  viewNotifications()
  {
    this.navCtrl.navigateForward('notifications');
  }

}
