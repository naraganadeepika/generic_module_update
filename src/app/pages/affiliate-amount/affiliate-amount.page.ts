import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl,Validators,FormGroup } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
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
  selector: 'app-affiliate-amount',
  templateUrl: './affiliate-amount.page.html',
  styleUrls: ['./affiliate-amount.page.scss'],
})
export class AffiliateAmountPage implements OnInit {
	affiliate_view:boolean = false;
	affiliate_segment:any;
	affiliate_summary:any=[];
	affiliate_history:any=[];
	affiliate_summary_err:any='';
	affiliate_history_err:any='';
	history_page:any=1;
	page:any=1;
  	constructor(
		public user:UserService,
		private iab: InAppBrowser,
		private errorService: ErrorService,
		public translate: TranslateService,
		public formBuilder: FormBuilder,
		private loading_:LoadingService,
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

   }
   segmentChanged(ev)
   {
     // console.log(ev.detail.value);
     this.affiliate_summary_err = '';
     this.affiliate_history_err = '';
     this.history_page=1;
     this.page=1;
     this.affiliate_segment=ev;
     if(ev == 'summary')
     {
        this.affiliate();
        this.affiliate_view=true; 
     }
     else
     {
       this.history();
       this.affiliate_view=false;
     }
   }
   async history()
  	{
	  	this.loading_.presentLoading();
	    
	    this.user.affiliate_history(this.history_page).subscribe((resp:any)=>{
	    	this.loading_.dismissLoading();
	    	if(resp.code==0){
	    		this.affiliate_history = resp.affiliate_history;
	    	}else{
	    		this.affiliate_history_err = this.translate.instant(resp.message);
	    		this.affiliate_history = [];
	    	}
	    },err=>{
	    	this.loading_.dismissLoading();
	    	this.errorService.errorsMethod(err);
	    })
	}


	 async affiliate()
  	{
	    this.loading_.presentLoading();
	    this.user.affiliate_summary(this.page).subscribe((resp:any)=>{
	    	this.loading_.dismissLoading();
	    	if(resp.code==0){
	    		this.affiliate_summary = resp.affiliate_summary;
	    	}else{
	    		this.affiliate_summary_err = this.translate.instant(resp.message);
	    		this.affiliate_summary = [];
	    	}
	    },err=>{
	    	this.loading_.dismissLoading();
	    	this.errorService.errorsMethod(err);
	    })
	}
	async lazySummary(event) 
    {
      

      this.loading_.presentLoading();
          
    setTimeout(() => {
        this.page = this.page+1 
      	this.user.affiliate_summary(this.page).subscribe((resp:any)=>{
	    	this.loading_.dismissLoading();
	    	if(resp.code==0){
	    		this.affiliate_summary.push(...resp.affiliate_summary);
	    	}else{
	    		this.affiliate_summary_err = this.translate.instant(resp.message);
	    		this.affiliate_summary = [];
	    	}
       

	    },(err)=>{
	      this.loading_.dismissLoading();
	     this.errorService.errorsMethod(err)
	    })
      event.target.complete();
      this.loading_.dismissLoading();
    }, 500);
  }


  async lazyHistory(event) 
    {
      

      this.loading_.presentLoading();
 
          
    setTimeout(() => {
        this.history_page = this.history_page+1 
      	this.user.affiliate_history(this.history_page).subscribe((resp:any)=>{
	    	this.loading_.dismissLoading();
	    	if(resp.code==0){
	    		this.affiliate_history.push(...resp.affiliate_history);
	    	}else{
	    		this.affiliate_history_err = this.translate.instant(resp.message);
	    		this.affiliate_history = [];
	    	}
       

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


}
