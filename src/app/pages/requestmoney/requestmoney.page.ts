import { Component, OnInit } from '@angular/core';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-requestmoney',
  templateUrl: './requestmoney.page.html',
  styleUrls: ['./requestmoney.page.scss'],
})
export class RequestmoneyPage implements OnInit {
  unit:any;
  typee:any;
  title:any;
  constructor(public navCtrl:NavController,private route: ActivatedRoute) {
    this.unit = '$'
   }
   ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.typee = params["type"];
  });

  this.setTitle();
  }

  setTitle()
  {
    console.log(this.typee);
    if(this.typee == 'request')
    {
      this.title = "request money from";
    }

    if(this.typee == 'send')
    {
      this.title = "send money to";
    }
  }

  goReview()
  {
    this.setNavigation(this.typee,'requestreview');
  }

  setNavigation(param:string,url:string)
  {

    let navigationExtras: NavigationExtras = {
      queryParams: {
          type: param
      }
    };
    
    this.navCtrl.navigateForward([url],navigationExtras);
  }

}
