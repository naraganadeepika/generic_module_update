import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl,Validators,FormGroup } from '@angular/forms';
import { NavController, AlertController,MenuController } from '@ionic/angular';
import { ToastersService, 
	UserService, 
	LoadingService,
	ErrorService, 
	AlertsService} from '../../providers'
import { isCordovaAvailable } from '../../providers/is-cordova-available'
import { environment } from '../../../environments/environment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Banks } from '../../providers/json/banks';


@Component({
  selector: 'app-bankaccounts',
  templateUrl: './bankaccounts.page.html',
  styleUrls: ['./bankaccounts.page.scss'],
})
export class BankaccountsPage implements OnInit {
mybanks:any =[];
  bankid:any;
  banks_nil:any;
  banks_nil_msg:any;
  banks:any = new Banks;
    	constructor(
		public user:UserService,
		private iab: InAppBrowser,
		private errorService: ErrorService,
		public translate: TranslateService,
		public formBuilder: FormBuilder,
		private loading_:LoadingService,
		public menu: MenuController,
		private toaster:ToastersService,
		private alert_: AlertsService,
		private navCtrl:NavController,
		private alertCtrl:AlertController
		) { }

 

async ngOnInit() {
    this.getdata();
  }



  async getdata()
  {
   this.loading_.presentLoading();
     //get banks here 
    this.user.getBanks().subscribe((resp:any) => { 
      // code5: For checking whether user done his kyc or not
        if(resp.code == 5){
         this.toaster.error_presentToast(this.translate.instant(resp.message));
         this.navCtrl.navigateRoot('upload-docs')
         this.loading_.dismissLoading();
        } 
        // code4:For error messages and no data messages
        else if(resp.code == 4){ 
         this.toaster.error_presentToast(this.translate.instant(resp.message));
         this.loading_.dismissLoading();
        }           
        else if(typeof(resp)=="object"){
         this.banks_nil_msg=false;
         this.mybanks=resp;

         this.loading_.dismissLoading();
          }    
        else
        {
          // this.user.presentToast(resp);
          this.banks_nil_msg=true;
          this.banks_nil=this.translate.instant(resp);
          this.loading_.dismissLoading();
        }

    },(err)=>{
      this.loading_.dismissLoading();
      this.errorService.errorsMethod(err)
    })
  }

async follow(data)
{
  this.loading_.presentLoading();
  var postdata={id:data};
  this.user.follow_up(postdata).subscribe((resp:any) => { 

    if(resp.code == 0)
    {
      this.toaster.success_presentToast(this.translate.instant(resp.message));
      this.getdata();
    }
    else{
      if(resp.time_to_wait != null)
      {
        this.toaster.warning_presentToast(this.translate.instant(resp.message) + 'time_to_wait');

      }
      else
      {
        this.toaster.warning_presentToast(this.translate.instant(resp.message));
      }
    }
    
    this.loading_.dismissLoading();
  },(err)=>{
      this.loading_.dismissLoading();
      this.errorService.errorsMethod(err)
    })
}


}
