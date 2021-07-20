import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  typee:string;
  title:any;
  constructor(public navCtrl:NavController,private route: ActivatedRoute) { }

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
      this.title = "Request Payments";
    }

    if(this.typee == 'send')
    {
      this.title = "Send Money";
    }
  }

  goMoneyPage()
  {
      this.setNavigation(this.typee,'requestmoney');
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
