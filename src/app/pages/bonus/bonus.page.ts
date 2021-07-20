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



@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.page.html',
  styleUrls: ['./bonus.page.scss'],
})
export class BonusPage implements OnInit {
	bonus_history:any;
   copy_history:any;
   bonus_summary:any;
   copy_summary:any;
   bonus_view:boolean;
   message:any;
   referal:any;
   whatsup:any;
   page:any=1;
   page_summary:any=1
   bonus_segment:any;

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
ngOnInit() {
    
   }
   ionViewWillEnter()
   {
      this.segmentChanged('summary');
      this.bonus_view=true;

   }

   segmentChanged(ev)
   {
     // console.log(ev.detail.value);
     this.bonus_segment=ev;
     if(ev == 'summary')
     {
        this.bonus(); 
     }
     else
     {
       this.history();
     }
   }

  

  async history()
  {
    this.loading_.presentLoading();
    
      this.user.bonus_history(this.page).subscribe((resp:any) => { 

        if(resp.code==15)
        {
          this.message=this.translate.instant(resp.message)
          this.referal=resp.referral_code;
          var path=environment.web_path+"/app-invitation ";
            this.whatsup=this.translate.instant('SHARE_MSG1')+" "+path+this.translate.instant('SHARE_MSG2')+" "+this.referal+" "+this.translate.instant('SHARE_MSG3');
            this.bonus_view=false;
        }
        else
        {
           this.bonus_history=resp.bonus_history;
           this.copy_history=this.bonus_history;
           this.bonus_view=true;

        }
        this.loading_.dismissLoading();
      

    },(err)=>{

      this.errorService.errorsMethod(err)
      this.loading_.dismissLoading();
    })
  }

  async lazyhistory(event) 
    {
      

      this.loading_.presentLoading();
          
    setTimeout(() => {
             this.page=this.page+1

    
      this.user.bonus_history(this.page).subscribe((resp:any) => { 

        if(resp.code==15)
        {
          this.message=this.translate.instant(resp.message)
          this.referal=resp.referral_code;
          var path=environment.web_path+"/app-invitation ";
            this.whatsup=this.translate.instant('SHARE_MSG1')+" "+path+this.translate.instant('SHARE_MSG2')+" "+this.referal+" "+this.translate.instant('SHARE_MSG3');
            this.bonus_view=false;
           this.loading_.dismissLoading();

        }
        else
        {
          this.bonus_history=resp.bonus_history;
          this.copy_history.push(... this.bonus_history);
           this.loading_.dismissLoading();
           // this.bonus_history=resp;
           this.bonus_view=true;

        }
      
       

    },(err)=>{
      this.loading_.dismissLoading();
     this.errorService.errorsMethod(err)
    })
      event.target.complete();
      this.loading_.dismissLoading();
    }, 500);
  }

   

   async bonus()
  {
    this.loading_.presentLoading();
    
      this.user.bonus_summary(this.page_summary).subscribe((resp:any) => { 

        if(resp.code==15)
        {
          this.message=this.translate.instant(resp.message)
          this.referal=resp.referral_code;
          var path=environment.web_path+"/app-invitation ";
            this.whatsup=this.translate.instant('SHARE_MSG1')+" "+path+this.translate.instant('SHARE_MSG2')+" "+this.referal+" "+this.translate.instant('SHARE_MSG3');
            this.bonus_view=false;
        }
        else
        {
           this.bonus_summary=resp.bonus_summary;
           this.copy_summary=this.bonus_summary;
           this.bonus_view=true;

        }
        this.loading_.dismissLoading();
      

    },(err)=>{

      this.errorService.errorsMethod(err)
      this.loading_.dismissLoading();
    })
  }

  async lazybonus(event) 
    {
      

      this.loading_.presentLoading();
          
    setTimeout(() => {
             this.page=this.page_summary+1

    
      this.user.bonus_summary(this.page).subscribe((resp:any) => { 

        if(resp.code==15)
        {
          this.message=this.translate.instant(resp.message)
          this.referal=resp.referral_code;
          var path=environment.web_path+"/app-invitation ";
            this.whatsup=this.translate.instant('SHARE_MSG1')+" "+path+this.translate.instant('SHARE_MSG2')+" "+this.referal+" "+this.translate.instant('SHARE_MSG3');
            this.bonus_view=false;
        }
        else
        {
          this.bonus_summary=resp.bonus_summary;
          this.copy_summary.push(...this.bonus_summary);


           // this.bonus_history=resp;
           this.bonus_view=true;

        }
        this.loading_.dismissLoading();
      
       

    },(err)=>{
      this.loading_.dismissLoading();
     this.errorService.errorsMethod(err)
    })
      event.target.complete();
      this.loading_.dismissLoading();
    }, 500);
  }
   toggle()
    {
      this.navCtrl.navigateForward("notifications");
    }
    get_amountType(transaction_type){
  if( transaction_type == 'winning amount'){
    return 'winning_amount.svg'
  }else if( transaction_type == 'deposit'){
    return 'deposit.svg'
  }else if( transaction_type == 'contest refund'){
    return 'refund.svg'
  }else if( transaction_type == 'withdraw' || transaction_type == 'bonus expired'){
    return 'withdraw.svg'
  }else if( transaction_type == 'contest charges' || transaction_type == 'join contest charges from deposit balance' || transaction_type == 'join contest charges'){
    return 'contest_charges.svg'
  }else{
    return 'bouns.svg'
  }

}

}
