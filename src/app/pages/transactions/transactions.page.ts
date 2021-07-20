import { Component, OnInit } from '@angular/core';
import { UserService,ErrorService, ToastersService } from '../../providers';
import { Router , ParamMap ,ActivatedRoute} from '@angular/router';
import { NavController,LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
contest_summary:any =[];
withdraw_summary:any =[];
deposit_summary:any =[];
winning_summary:any =[];
bonus_summary:any=[];
refund_summary:any=[];
affiliate_summary:any=[];
dest:any;
transaction_id:any;
sum:any;
contest_enable:boolean=false;
withdraw_enable:boolean=false;
deposit_enable:boolean=false;
winning_enable:boolean=false;
bonus_enable:boolean=false;
refund_enable:boolean=false;
affiliate_credit:boolean=false;

  constructor(public user:UserService,
		private toaster:ToastersService,
   private activeRoute: ActivatedRoute,
   public navCtrl:NavController,
   public loading:LoadingController,
   public errorService:ErrorService,
   public translate: TranslateService
   ) { 
     }
  
  ngOnInit() {

 }
  ionViewWillEnter(){
     this.transaction_id=this.activeRoute.snapshot.paramMap.get('id');
    this.getTransaction();
  }
  //get transaction details
  
  async getTransaction()
  {
    const loading = await this.loading.create({
      spinner: null,
      // duration: 2000,
      message: '',
    }); 
     loading.present();
  this.user.getTransaction(this.transaction_id).subscribe((resp:any) => {
    loading.dismiss();
    // code4:For error messages and no data messages
      if(resp.code == 4)
      {
        this.toaster.warning_presentToast(this.translate.instant(resp.message))
        this.navCtrl.navigateBack('/wallet')
        return false;
      }
      //code6:For checking whether data available or not
      if(resp.code == 7)
      {
        this.toaster.warning_presentToast(this.translate.instant(resp.message))
        this.navCtrl.navigateBack('/wallet')
        return false;
      }
      if(resp.type == 'bonus_amount')
      {  
        this.bonus_summary=resp;
        this.bonus_enable=true;
      }
      else if(resp.type == 'contest')
      {
        this.contest_summary=resp;
        this.contest_enable=true;
      }
      else if(resp.type == 'withdraw')
      {
        this.withdraw_summary=resp;
        this.withdraw_enable=true;
      }
      else if(resp.type == 'deposit')
      {
        this.deposit_summary=resp;
        this.deposit_enable=true;
      }
      else if(resp.type == 'winning')
      {
        this.winning_summary=resp;
        this.winning_enable=true;
      }
      else if(resp.type == 'contest_refund')
      {
        this.refund_summary=resp;
        this.refund_enable=true;
      }
      else if(resp.type == 'affiliate_credit')
     {
       this.affiliate_summary=resp;
       this.affiliate_credit=true;
     }

    
    },(err)=>{
      loading.dismiss();
      this.errorService.errorsMethod(err)
    })
  
 }

  toggle()
  {
    this.navCtrl.navigateForward("notifications");
  }

}
