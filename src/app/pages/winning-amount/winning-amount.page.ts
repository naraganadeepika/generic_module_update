import { Component, OnInit } from '@angular/core';
import { UserService, ErrorService, ToastersService, LoadingService } from '../../providers';
import {  NavController} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-winning-amount',
  templateUrl: './winning-amount.page.html',
  styleUrls: ['./winning-amount.page.scss'],
})
export class WinningAmountPage implements OnInit {
	winning_view:boolean = false;
	winning_segment:any;
	winning_summary:any=[];
	winning_history:any=[];
	winning_summary_err:any='';
	winning_history_err:any='';
	history_page:any=1;
	page:any=1;
  constructor(private toaster:ToastersService,public user:UserService,public errorService:ErrorService,
  	    public translate: TranslateService,public navCtrl: NavController,private loading_:LoadingService,) { }

  ngOnInit() {
  }

  ionViewWillEnter()
   {
      this.segmentChanged('summary');

   }
   segmentChanged(ev)
   {
     // console.log(ev.detail.value);
     this.winning_summary_err = '';
     this.winning_history_err = '';
     this.winning_segment=ev;
     this.page=1;
     this.history_page=1;
     if(ev == 'summary')
     {
        this.winning();
        this.winning_view=true; 
     }
     else
     {
       this.history();
       this.winning_view=false;
     }
   }

   	async history()
  	{
	  	this.loading_.presentLoading();
	    this.user.winning_history(this.page).subscribe((resp:any)=>{
	    	this.loading_.dismissLoading();
	    	console.log(resp);
	    	if(resp.code==0){
	    		this.winning_history = resp.winning_history;
	    	}else{
	    		this.winning_history_err = this.translate.instant(resp.message);
	    		this.winning_history = [];
	    	}
	    },err=>{
	    	this.loading_.dismissLoading();
	    	this.errorService.errorsMethod(err);
	    })
	}


	 async winning()
  	{
	    this.loading_.presentLoading();
	    this.user.winning_summary(this.page).subscribe((resp:any)=>{
	    	this.loading_.dismissLoading();
	    	if(resp.code==0){
	    		this.winning_summary = resp.winning_summary;
	    	}else{
	    		this.winning_summary_err = this.translate.instant(resp.message);
	    		this.winning_summary = [];
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
      	this.user.winning_summary(this.page).subscribe((resp:any)=>{
	    	this.loading_.dismissLoading();
	    	if(resp.code==0){
	    		this.winning_summary.push(...resp.winning_summary);
	    	}else{
	    		this.winning_summary_err = this.translate.instant(resp.message);
	    		this.winning_summary = [];
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
      	this.user.winning_history(this.history_page).subscribe((resp:any)=>{
	    	this.loading_.dismissLoading();
	    	if(resp.code==0){
	    		this.winning_history.push(...resp.winning_history);
	    	}else{
	    		this.winning_history_err = this.translate.instant(resp.message);
	    		this.winning_history = [];
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
