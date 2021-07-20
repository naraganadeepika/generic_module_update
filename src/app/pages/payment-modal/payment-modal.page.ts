import { Component, OnInit , Input } from '@angular/core';
import { UserService } from '../../providers/user/user.service';
import { NavController,ModalController, AlertController} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { isCordovaAvailable } from '../../providers/is-cordova-available'
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavParams } from '@ionic/angular';
import { ErrorService, ToastersService, LoadingService, AlertsService } from '../../providers';
declare var RazorpayCheckout: any;


@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.page.html',
  styleUrls: ['./payment-modal.page.scss'],
})
export class PaymentModalPage implements OnInit {

amount: any;
url:any;
ptm_lnk = false;
ptm_mny;
  urlParameter:any;
  singleURLParam:any;
  payment_request_id:any;
  phne_pay_button:boolean=false;
pay_ptm_wal = false;
ptm_pay_show = false;
phn_lnk = false;phn_pe_wal = false;phn_pay_show = false;phn_wallet_bal:number=0;
gpay_lnk = false;g_pay_wal = false;g_pay_show = false;
insta_lnk = false;insta_wal = false;insta_show = false;
avalible_payments=[];
error_msg:any = '';

currency: string = 'INR';
  currencyIcon: string = '₹';
  razor_key:any = '';
  phone_number:any;
email:any;
  cardDetails: any = {};
  alert_Data = {header:'',img:'',message:''};

    


  constructor(
   public navCtrl:NavController,
   public user:UserService,
   private toaster:ToastersService,
   private alert_: AlertsService,
   public modalController:ModalController,
   public translate: TranslateService,
   private iab: InAppBrowser,
   private loading_: LoadingService,
   private navParams: NavParams,
   private errorService:ErrorService,
   private alertCtrl:AlertController,
             
  ) { 
  this.amount=navParams.get('amount');
  this.ptm_mny=this.amount;
  this.get_balance();
  }
  //get wallet balance

  get_balance()
  {
    this.user.avalible_payment().subscribe((resp:any) => {
      this.error_msg = '';
      if(typeof(resp)== 'object'){
        this.avalible_payments=[];
        if(resp.code == 5)
        {
         this.error_msg = this.translate.instant(resp.message)
         // this.user.presentToast(resp.message);
         return false;
        }else if(resp.code == 4)
        {
         this.error_msg = this.translate.instant(resp.message);
         // this.user.presentToast(resp.message);
         return false;
        }else{
          this.avalible_payments=resp
        }
      }else{
        this.avalible_payments=resp
      }
      
    })


    this.user.get_phone_exists().subscribe((resp:any) => {
      if(resp.phone_pe_number == null)
      {
        this.phn_lnk=true;
      }
      else{
        this.phn_wallet_bal=resp.phone_pe_balance;
      }
       },(err)=>{
         this.errorService.errorsMethod(err)
       });
  }

  check_avalible(payment){
    if(this.avalible_payments.some(e => e===payment)){
      return true;
    }else{
      return false;
    }
    
  }
  //check balance

  bal_check(type,w_money){
    if(type=='paytm')
    {
      this.ptm_pay_show = true;
      this.phn_pay_show = false;
        let k = w_money - this.amount;
          if(k >= 0){
            this.pay_ptm_wal = true;
          }else {
            this.pay_ptm_wal = false;
            let v = this.amount - w_money;
          }
    }
    else if(type=='phn_pe')
    {
      this.phn_pay_show = true;
      this.ptm_pay_show = false;
        let k = w_money - this.amount;
          if(k >= 0){
            this.phn_pe_wal = true;
          }else {
            this.phn_pe_wal = false;
            let v = this.amount - w_money;
          }
    }
  }
//pay via UPI's or wallets

async pay_amount(payment_type, wallet, upi){
  

  if(payment_type=='paytm')
  {
    var data ={message:this.translate.instant('ADD_AMOUNT_ALERT')+' '+'Rs:' + this.amount,subheader:'',header:this.translate.instant('ARE_YOU_SURE')};
    if(this.alert_.confirmAlert(data)){
      this.alert_Data.message=this.translate.instant('CURRENTLY_UNAVAILABLE');
      this.alert_Data.header='';
      this.alert_Data.img='error';
      this.alert_.presentAlert(this.alert_Data);

    }
  }
  else if(payment_type=='phn_pe')
  {
    var data ={message:this.translate.instant('ADD_AMOUNT_ALERT')+' '+'Rs:' + this.amount,subheader:'',header:this.translate.instant('ARE_YOU_SURE')};
    if(this.alert_.confirmAlert(data)){
      this.alert_Data.message=this.translate.instant('CURRENTLY_UNAVAILABLE');
      this.alert_Data.header='';
      this.alert_Data.img='error';
      this.alert_.presentAlert(this.alert_Data);
                  //  var data:any={amount:JSON.parse(this.amount),mobileNumber:localStorage.getItem('phone_pe_num')}
            // if(upi != 0 )
            //   {
            //       loading.present();
            //       this.user.phonepe_upi_debit(data).subscribe((resp:any) => {
            //        loading.dismiss();
            //         const browser = this.iab.create(resp,'_blank', 'location=yes');
            //          },(err)=>{
            //            loading.dismiss();
            //            this.errorService.errorsMethod(err)
            //          });
            //    }
            //  else{
            //     this.user.phonepe_wallet_debit(data).subscribe((resp:any) => {
                    // code4:For error messages and no data messages
            //       if(resp.code == 4)
            //       {
            //         this.user.presentToast(resp.message)
            //         return false;
            //       }
            //       this.user.presentsuccessAlert(resp)
            //        },(err)=>{
            //          this.errorService.errorsMethod(err)
            //        }); 
            //  }

    }

  }
}


  ngOnInit() {
  }
  closeModal()
  {
  this.modalController.dismiss();
  }
 //payments gateways
  async openGateway(mode)
  {
    var data;
  if(mode=='paytm')
  {
  this.alert_Data.message=this.translate.instant('CURRENTLY_UNAVAILABLE');
      this.alert_Data.header='';
      this.alert_Data.img='error';
      this.alert_.presentAlert(this.alert_Data);
  }
  else if(mode=='phone_pe')
  {
    this.alert_Data.message=this.translate.instant('CURRENTLY_UNAVAILABLE');
      this.alert_Data.header='';
      this.alert_Data.img='error';
      this.alert_.presentAlert(this.alert_Data);
         // this.phne_pay_button=true;
   }
  else if(mode=='google_pay')
  {
  this.alert_Data.message=this.translate.instant('CURRENTLY_UNAVAILABLE');
      this.alert_Data.header='';
      this.alert_Data.img='error';
      this.alert_.presentAlert(this.alert_Data);
  }
    else if(mode=='amazon_pay')
    {
      this.alert_Data.message=this.translate.instant('CURRENTLY_UNAVAILABLE');
      this.alert_Data.header='';
      this.alert_Data.img='error';
      this.alert_.presentAlert(this.alert_Data);
    }
  else if(mode=='instamojo')
  {
  this.addamountconfirmation(this.amount);
  }
  else if(mode=='easebuzz')
  {

    data ={message:this.translate.instant('ADD_AMOUNT_ALERT')+' '+'Rs:' + this.amount,subheader:'',header:this.translate.instant('ARE_YOU_SURE')};
    if(this.alert_.confirmAlert(data)){

      this.loading_.presentLoading();
      var postData={amount:this.amount}
      this.user.easebuzz_initiate_payment(postData).subscribe((resp:any) => {
       if(resp.code==4){
         this.alert_Data.message=this.translate.instant(resp.message);
          this.alert_Data.header='';
          this.alert_Data.img='error';
          this.alert_.presentAlert(this.alert_Data);
         return false;
       }
        this.loading_.dismissLoading();
        this.Open_easebuzz_brow(resp);
      },(err)=>{
        this.loading_.dismissLoading();
        this.errorService.errorsMethod(err)
      })

    }
    

    
  }
  else if(mode=='cashfree')
  {
    data ={message:this.translate.instant('ADD_AMOUNT_ALERT')+' '+'Rs:' + this.amount,subheader:'',header:this.translate.instant('ARE_YOU_SURE')};
    if(this.alert_.confirmAlert(data)){

      this.loading_.presentLoading();
      var postData={amount:this.amount}
     this.user.pay_on_cashfree(postData).subscribe((resp:any) => {
       if(resp.code==4){
         
         this.alert_Data.message=this.translate.instant(resp.message);
      this.alert_Data.header='';
      this.alert_Data.img='error';
      this.alert_.presentAlert(this.alert_Data);
         return false;
       }
        this.loading_.dismissLoading();
        this.Open_cashfree_brow(resp);
      },(err)=>{
        this.loading_.dismissLoading();
        this.errorService.errorsMethod(err)
      })

    }
      
  }
  else if(mode=='razorpay')
  {
    data ={message:this.translate.instant('ADD_AMOUNT_ALERT')+' '+'Rs:' + this.amount,subheader:'',header:this.translate.instant('ARE_YOU_SURE')};
    if(this.alert_.confirmAlert(data)){

      this.loading_.presentLoading();
       this.user.getRazorpay_credentials().subscribe((resp:any) => {
         this.loading_.dismissLoading();
          this.razor_key = resp.key;
          this.phone_number = resp.phone_number;
          this.email = resp.email;      
          this.pay_on_Razorpay(this.amount);
        },(err)=>{
          this.loading_.dismissLoading();
          this.errorService.errorsMethod(err)
        })

    }
      
  }
}

  Open_easebuzz_brow(data:any){
    if(data.code==0){
        const browser = this.iab.create(data.payment_url,'_blank', 'location=yes');


         browser.on('loadstop').subscribe(event => {
        if (event.url.indexOf("?") > 0) {
        let splitURL =event.url.split("?");
        let splitParams = splitURL[1].split("&");
        let i: any;
        for (i in splitParams)
         {
           this.singleURLParam = splitParams[i].split('=');
             let urlParameter;
             if(this.singleURLParam[0]=="payment_status")
             {
                this.urlParameter = {
                'name': this.singleURLParam[0],
                'value': this.singleURLParam[1]
                };
                this.payment_request_id=this.urlParameter.value
             }
          }

          var url_pram = splitURL[0].split("/");
          if(url_pram[3] == 'payment-status' || url_pram[4] == 'payment-status')
          {
            setTimeout(() =>{
              browser.close();
              this.closeModal();
            }, 5000);
            
            if(this.payment_request_id == "SUCCESS"){
              this.alert_Data.message=this.translate.instant('WALLET_ADDED');
              this.alert_Data.header='';
              this.alert_Data.img='success';
              this.alert_.presentAlert(this.alert_Data);
            }else if(this.payment_request_id == "CANCELLED"){
              this.alert_Data.message=this.translate.instant('TANSACTION_CANCELLED');
              this.alert_Data.header='';
              this.alert_Data.img='warning';
              this.alert_.presentAlert(this.alert_Data);
              return false;
            }else{
              this.alert_Data.message=this.translate.instant('TANSACTION_FAILED');
              this.alert_Data.header='';
              this.alert_Data.img='warning';
              this.alert_.presentAlert(this.alert_Data);
              return false;
            }
            
          }
        
        }
         


        
      });

      }
  }

  Open_cashfree_brow(data:any){
      if(data.status=="OK"){
        const browser = this.iab.create(data.paymentLink,'_blank', 'location=yes');


         browser.on('loadstop').subscribe(event => {
        if (event.url.indexOf("?") > 0) {
        let splitURL =event.url.split("?");
        let splitParams = splitURL[1].split("&");
        let i: any;
        for (i in splitParams)
         {
           this.singleURLParam = splitParams[i].split('=');
             let urlParameter;
             if(this.singleURLParam[0]=="order_id")
             {
                this.urlParameter = {
                'name': this.singleURLParam[0],
                'value': this.singleURLParam[1]
                };
                this.payment_request_id=this.urlParameter.value
             }
          }

          var url_pram = splitURL[0].split("/");
          if(url_pram[3] == 'payment-status' || url_pram[4] == 'payment-status')
          {
            browser.close();
            this.closeModal();
            var postData={order_id:this.payment_request_id}
            this.user.cash_free_status(postData).subscribe((resp:any) => {
              if(resp.code == 4)
              {
                this.alert_Data.message=this.translate.instant(resp.message);
                this.alert_Data.header='';
                this.alert_Data.img='warning';
                this.alert_.presentAlert(this.alert_Data);
                return false;
              } 
              if(resp.code != 4)
              {this.alert_Data.message=this.translate.instant(resp.message);
                this.alert_Data.header='';
                this.alert_Data.img='success';
                this.alert_.presentAlert(this.alert_Data);
              } 
            },(err)=>{
                this.errorService.errorsMethod(err)
               })
          }
        
        }
         


        
      });

      }
  }


  async link()
  {
    this.alert_Data.message=this.translate.instant('CURRENTLY_UNAVAILABLE');
      this.alert_Data.header='';
      this.alert_Data.img='error';
      this.alert_.presentAlert(this.alert_Data);
    // this.presentPrompt();
  }
  async presentPrompt() {
  let alert = await this.alertCtrl.create({
    header: 'Enter mobile number',
    inputs: [
      {
        name: 'phone',
        placeholder: 'Mobile number'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
        }
      },
      {
        text: 'Yes',
        handler: data => {
          var phn= new RegExp(/^(([6|7|8|9])[0-9]{9})+$/);
             if(data.phone == "")
             {
               this.toaster.warning_presentToast('PHONE_REQUIRED');
             }
             else if( !phn.test(data.phone))
              {
                this.toaster.warning_presentToast('PHONE_PATTERN');
              }
             else{
               var info={phone_number:data.phone}
               localStorage.setItem('phone_pe_num',data.phone)
               this.user.phone_pe_otp(info).subscribe((resp:any) => {
                 this.alert_Data.message=this.translate.instant(resp);
                this.alert_Data.header='';
                this.alert_Data.img='success';
                this.alert_.presentAlert(this.alert_Data);
               },(err)=>{
                 this.errorService.errorsMethod(err)
               });
               this.modalController.dismiss()
               this.navCtrl.navigateRoot('otp/' + this.amount);
             }
         
        }
      }
    ]
  });
  await alert.present();
}

phone_pe()
{
  this.modalController.dismiss()
  this.navCtrl.navigateRoot('phonepe-otp');
}

  //add money confirmation (instamojo)
  async addamountconfirmation(amount) {
      

     var data ={message:this.translate.instant('ADD_AMOUNT_ALERT')+' '+'Rs:' + this.amount,subheader:'',header:this.translate.instant('ARE_YOU_SURE')};
    if(this.alert_.confirmAlert(data)){

      this.loading_.presentLoading();
       this.user.add_Amount(this.amount).subscribe((resp:any) => { 
         this.loading_.dismissLoading();
          if(resp.code == 4)
        {
          this.toaster.error_presentToast(this.translate.instant(resp.message));
          return false;
        }
        if(resp.payment_url != null)
        {          
         const browser = this.iab.create(resp.payment_url,'_blank', 'location=yes');


         this.url=resp.payment_request_id
         browser.on('loadstop').subscribe(event => {
        if (event.url.indexOf("?") > 0) {
        let splitURL =event.url.split("?");
        let splitParams = splitURL[1].split("&");
        let i: any;
       for (i in splitParams)
       {
         this.singleURLParam = splitParams[i].split('=');
           let urlParameter;
           if(this.singleURLParam[0]=="payment_request_id")
           {
              this.urlParameter = {
              'name': this.singleURLParam[0],
              'value': this.singleURLParam[1]
              };
              this.payment_request_id=this.urlParameter.value
           }
        }
        var url_pram = splitURL[0].split("/");
          if(url_pram[3] == 'payment-status' || url_pram[4] == 'payment-status')
          {
            browser.close();
            this.closeModal();
            this.user.paymentgateway(this.payment_request_id).subscribe((resp:any) => {

              if(resp.message != undefined)
              {
                    this.user.presentsuccessAlert(this.translate.instant(resp.message));
              } 
            },(err)=>{
                this.errorService.errorsMethod(err)
               })
          }
        }
      });

        }
        },(err)=>{
          this.loading_.dismissLoading();
          this.errorService.errorsMethod(err)
        })

    }

  }
//unlink number in phone pe

  async unread(pymnt_type)
  {
    
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('CONFIRM'),
      message: this.translate.instant('UNLINK_PHONE_NUMBER_CONFIRMATION'),
      buttons: [
        {
          text: this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.translate.instant('YES'),
          handler: () => {
            this.loading_.presentLoading();
            var data={payment_type:pymnt_type}
             this.user.remove_phn_num(data).subscribe((resp:any) => {
               // code4:For error messages and no data messages
                 if(resp.code == 4)
                 {
                   this.toaster.error_presentToast(this.translate.instant(resp.message));
                   return false;
                 }
                 this.loading_.dismissLoading();
                 this.user.presentsuccessAlert(this.translate.instant(resp.message));
                 this.get_balance();
               },(err)=>{
                 this.loading_.dismissLoading();
                 this.errorService.errorsMethod(err)
               }); 
          }
        }
      ]
    });

    await alert.present();
    
  }
  async pay_on_Razorpay(amount){

    var options = {
      description: 'Wallet Deposit',
      image: 'https://ant11.org/assets/img/favicon.png',
      currency: this.currency,
      key: this.razor_key,
      amount: amount*100,
      name: this.user.username,
      remember_customer:false,
      // external: {
      // // wallets: ['paytm','amazonpay','phonepe']
      // },
      prefill: {
        email: this.email,
        contact: this.phone_number,
        name: this.user.username
      },
      theme: {
        color: '#F37254'
      },
      modal: {
        ondismiss: ()=> {
          this.toaster.presentToast(this.translate.instant('TANSACTION_CANCELLED'));
        }
      }
    };
    RazorpayCheckout.open(options,async (payment_id)=>{
       var data={
          payment_id:payment_id,
          amount:amount*100
        }

       this.loading_.presentLoading();
    this.user.razorpay(data).subscribe((resp:any) => {
     this.loading_.dismissLoading();
     this.user.presentsuccessAlert(this.translate.instant(resp.message));
     this.modalController.dismiss();       
    },(err)=>{
      this.loading_.dismissLoading();
      this.errorService.errorsMethod(err)
       })
    },(error)=>{
      this.errorService.errorsMethod(error)
    })


    

  }








}
