import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl,Validators,FormGroup } from '@angular/forms';
import { NavController, AlertController,MenuController, LoadingController } from '@ionic/angular';
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
  selector: 'app-deposit-history',
  templateUrl: './deposit-history.page.html',
  styleUrls: ['./deposit-history.page.scss'],
})
export class DepositHistoryPage implements OnInit {
	deposit_view:boolean = false;
	deposit_segment:any;
	deposit_summary:any=[];
	deposit_history:any=[];
	deposit_summary_err:any='';
	deposit_history_err:any='';
	history_page:any=1;
	page:any=1;
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
		private alertCtrl:AlertController,
		private loadingCtrl:LoadingController
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
     this.deposit_summary_err = '';
     this.deposit_history_err = '';
     this.history_page=1;
     this.page=1;
     this.deposit_segment=ev;
     if(ev == 'summary')
     {
        this.deposit();
        this.deposit_view=true; 
     }
     else
     {
       this.history();
       this.deposit_view=false;
     }
   }

   	async history()
  	{
	  	this.loading_.presentLoading();
	    this.user.deposit_history(this.history_page).subscribe((resp:any)=>{
	    	this.loading_.dismissLoading();
	    	if(resp.code==0){
	    		this.deposit_history = resp.deposit_history;
	    	}else{
	    		this.deposit_history_err = this.translate.instant(resp.message);
	    		this.deposit_history = [];
	    	}
	    },err=>{
	    	this.loading_.dismissLoading();
	    	this.errorService.errorsMethod(err);
	    })
	}


	 async deposit()
  	{
	    this.loading_.presentLoading();
	    this.user.deposit_summary(this.page).subscribe((resp:any)=>{
	    	this.loading_.dismissLoading();
	    	if(resp.code==0){
	    		this.deposit_summary = resp.deposit_summary;
	    	}else{
	    		this.deposit_summary_err = this.translate.instant(resp.message);
	    		this.deposit_summary = [];
	    	}
	    },err=>{
	    	this.loading_.dismissLoading();
	    	this.errorService.errorsMethod(err);
	    })
	}


	async lazyHistory(event) 
    {
      

      this.loading_.presentLoading();
          
    setTimeout(() => {
        this.history_page = this.history_page+1 
      	this.user.deposit_history(this.history_page).subscribe((resp:any)=>{
	    	this.loading_.dismissLoading();
	    	if(resp.code==0){
	    		this.deposit_history.push(...resp.deposit_history);
	    	}else{
	    		this.deposit_history_err = this.translate.instant(resp.message);
	    		this.deposit_history = [];
	    	}
       

	    },(err)=>{
	      this.loading_.dismissLoading();
	     this.errorService.errorsMethod(err)
	    })
      event.target.complete();
      this.loading_.dismissLoading();
    }, 500);
  }
  async lazySummary(event) 
    {
      

      this.loading_.presentLoading();
 
          
    setTimeout(() => {
        this.page = this.page+1 
      	this.user.deposit_summary(this.page).subscribe((resp:any)=>{
	    	this.loading_.dismissLoading();
	    	if(resp.code==0){
	    		this.deposit_summary.push(...resp.deposit_summary);
	    	}else{
	    		this.deposit_summary_err = this.translate.instant(resp.message);
	    		this.deposit_summary = [];
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
     get_payment_mode(payment_mode){
   	if( payment_mode == 'cashfree'){
   		return 'cashfree.png'
   	}else if( payment_mode == 'instamojo'){
   		return 'instamojo.jpeg'
   	}else if( payment_mode == 'razorpay'){
   		return 'razorpay.png'
   	}else if( payment_mode == 'easebuzz'){
   		return 'easebuzz.png'
   	}
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
