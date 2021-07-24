import { Component, OnInit ,ViewChild } from '@angular/core';
import { AlertController,Platform,IonInfiniteScroll,ModalController,ActionSheetController } from '@ionic/angular';
import { UserService, ErrorService, ToastersService, LoadingService } from '../../providers';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder,FormControl,Validators,FormGroup } from '@angular/forms';
import { Banks } from '../../providers/json/banks';
import { States } from '../../providers/json/states-cities';
import {  NavController} from '@ionic/angular';
import { Router, ParamMap ,ActivatedRoute} from '@angular/router';
import { isCordovaAvailable } from '../../providers/is-cordova-available'
import { PaymentModalPage } from '../payment-modal/payment-modal.page';
import { environment } from '../../../environments/environment';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { File } from '@ionic-native/file/ngx';

import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { LocalNotifications, ELocalNotificationTriggerUnit, ILocalNotificationActionType, ILocalNotification } from '@ionic-native/local-notifications/ngx';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  // @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  error_msg:any ='';
  browser:any;
  transactions:any = [];
  amount:any=0;
  wallet=[];
  button_ev:any;
  summary_div:boolean =false;
  transactions_div:boolean = false;
  addAmount_div:boolean =false;
  addBank_div:boolean =false;
  withdraw_div:boolean =false;
  bankList_div:boolean=false;
  submitted:boolean =false;
  banks:any = new Banks;
  mybank:any;
  all_cities:any= new States().cities;
  states:any =  new States().states;
  cities:any=[];
  mybanks:any =[];
  withdraws:any =[];
  withdraws_reqs:any =[];
  addWithdrawif:boolean=false;
  cancel_id:any=0;
  dest:any;
  url:any;
  urlParameter:any;
  singleURLParam:any;
  payment_request_id:any;
  trigger:any=false;
  trans_msg:any=false;
  trans_msg_exist:any;
  with_msg:any=false;
  with_msg_exist:any;

  page:any=1;
  cpy_trasctions:any = this.transactions;
  startdate:any;
  enddate:any;
  filterpage:any=1;
  myDate: any = new Date();
  year:any= new Date();
  month:any=new Date();
  startDate:any;
  endDate:any;

  withdrawpage:any=1;
  cpy_withdraws:any = this.withdraws;
  filtertransactions:any=false;
  filterwithdraws:any=false;
  fee:any=0;
  nobanks:any=false;
  nobanks_text:any;

  bonus_balance :any=0;
  deposit_balance :any=0;
  winning_balance:any=0;
  affiliate_balance:any=0;
  affiliate_is:boolean=false;

  min_deposit:any=0;
  max_deposit:any=0;
  min_withdraw:any=0;
  max_withdraw:any=0;

  valid_add:boolean=false;
  valid_with:boolean=false;

  proof = { filename:'bank_doc',base64:''};
  bankUpload:boolean=false;
  form:boolean=false;
  PAN_required:boolean=false;
  bank_passbook_err_msg:any = '';
  touched_amountForm:boolean=false;
  touched_bankForm:boolean=false;
  touched_withdrawalForm:boolean=false;
  public amountForm : FormGroup;
  public bankForm: FormGroup;
  public withdrawalForm:FormGroup;
  public transactionfilter:FormGroup;
  public withdrawfilter:FormGroup;
  constructor(
    public alertController: AlertController,
    private iab: InAppBrowser,
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    public user:UserService,
     public route: Router,
     private activeRoute: ActivatedRoute,
     private plt: Platform,
     public modalController:ModalController,
      public camera:Camera,
      public actionSheetCtrl: ActionSheetController,
      public errorService:ErrorService,
      public base64: Base64,
      private file: File,
      private toaster:ToastersService,
      private loading_: LoadingService,
      private localNotifications: LocalNotifications,
    public navCtrl: NavController ) { 



    //local notifications
    if(isCordovaAvailable())
     {
       this.plt.ready().then(() => {
        this.localNotifications.on('trigger').subscribe(res => {
        // console.log("trigger")
        let msg = res.data ? res.data.mydata : '';
      });
    });
     }
  
    }

  //form declarations with validators

  ngOnInit() {
    // var val = this.user.getDestn();
     this.banks = this.banks.banks;
    this.bankForm = this.formBuilder.group({
            nick_name: ['', [Validators.required, Validators.minLength(3),Validators.pattern('^([A-Za-z0-9 .]{3,})+')]],
            holder_name: ['', [Validators.required, Validators.minLength(3),Validators.pattern('^([A-Za-z .]{3,})+')]],
            account_number: ['', [Validators.required,Validators.min(10000),Validators.pattern('^([0-9])+')]],
            account_type: ['', [Validators.required]],
            bank_name: ['', [Validators.required]],
            branch_name: ['', [Validators.required, Validators.minLength(3),Validators.pattern('^([A-Za-z0-9 .]{3,})+')]],
            ifsc_code: ['', [Validators.required,Validators.pattern('^[A-Z]{4}[0][A-Z0-9]{6}$')]],
            city_name: ['', [Validators.required]],
            state_name: ['', [Validators.required]],
            bank_doc:['']
        })
    this.amountForm = this.formBuilder.group({
            amount: ['',[Validators.required]]
        })
    this.withdrawalForm = this.formBuilder.group({
            withdrawal_amount: [''],
            bank_name:['', [Validators.required,]]
        })
    this.transactionfilter=this.formBuilder.group({

            start_date:['',[Validators.required]],
            end_date:['',[Validators.required]]

     })
    this.withdrawfilter=this.formBuilder.group({

            start_date:['',[Validators.required]],
            end_date:['',[Validators.required]]

     })


     // this.ionViewDidLoad();

  }
  max_dipo(){
    return this.max_deposit;
  }

  ionViewWillEnter()
  {
  var des= this.user.getDestn();
  this.user.setDestn('Transactions');
  // console.log(des)
  if(des != 'Transactions')
   {
      this.transactionsData();
      this.segmentChanged(des);   
     
   }
   else{
       this.segmentChanged('Transactions');  
   }

  }

// complete details of transaction related to trip charges and withdraws

  async transFulldtls(id){
       this.navCtrl.navigateRoot('transactions/'+id);
     }

  //ion change method

  segmentChanged(ev) {
    this.touched_amountForm = false;
    this.touched_bankForm =false;
    this.touched_withdrawalForm = false;
    this.bankList_div =false;
     //this.button_ev=ev;
   if(ev=='Transactions'){
      this.transactionsData();

    }else if(ev=='AddMoney'){
      this.amountForm.reset();

      this.addAmountData();

    }
    else if(ev=='AddBank'){
      this.bankForm.reset();

      this.addBankData();
    }
    else if(ev=='Withdraw'){
      this.withdrawalForm.reset();
      this.withdrawData();
    }
  }

//page reload

 async doRefresh(refresher) {
     
    setTimeout(() => {
       this.amountForm.reset();
      this.withdrawalForm.reset();
      this.bankForm.reset();
      if(this.transactions_div){
        this.transactionsData();
      }
      refresher.target.complete();
    }, 2000);
  }
  
//transactions div
  
 async transactionsData(){
   this.summary_div = false;
    this.transactions_div = true;
    this.addAmount_div=false;
    this.addBank_div =false;
    this.withdraw_div = false;
    this.loading_.presentLoading();
    
    this.year=this.myDate.getFullYear()
    this.month=this.myDate.getMonth();
    this.year = this.year-1
    this.month=this.month+1
    this.startDate= this.year +'/'+this.month+'/'+ this.myDate.getDate()
    this.endDate= this.myDate.getFullYear() +'/'+ this.month +'/'+ this.myDate.getDate()
    localStorage.setItem('startDate',this.startDate)
    localStorage.setItem('endDate',this.endDate)

    this.filterpage=1
    var account=
        {
          page:this.filterpage,
          startDate:this.startDate,
          endDate:this.endDate
        }

    this.user.getTransactions(account).subscribe((resp:any) => { 
      // code5: For checking whether user done his kyc or not
      this.loading_.dismissLoading();
        if(resp.code == 5)
          {
            this.toaster.warning_presentToast(this.translate.instant(resp.message));
            this.navCtrl.navigateForward('/upload-docs');
            this.min_deposit=parseInt(resp.min_deposit);
            this.max_deposit=parseInt(resp.max_deposit);
            this.min_withdraw=parseInt(resp.min_withdraw);
            this.max_withdraw=parseInt(resp.max_withdraw);
          }
       // code4:For error messages and no data messages
        else if(resp.code == 4){
           this.toaster.warning_presentToast(this.translate.instant(resp.message));
           this.min_deposit=parseInt(resp.min_deposit);
           this.max_deposit=parseInt(resp.max_deposit);
           this.min_withdraw=parseInt(resp.min_withdraw);
           this.max_withdraw=parseInt(resp.max_withdraw);
        } 
        else if (resp.message == undefined)
        {
           this.trans_msg=false;
           this.filterpage=this.filterpage+1;
           this.cpy_trasctions=resp.transactions;
           this.bonus_balance = resp.balance.bonus_balance;

           this.deposit_balance = resp.balance.deposit_balance;
           // this.user.wallet_balance = this.deposit_balance
           this.winning_balance = resp.balance.winning_balance;
           this.affiliate_balance = resp.balance.affiliate_balance;
           this.affiliate_is = resp.balance.affiliate;
           this.min_deposit=parseInt(resp.min_deposit);
           this.max_deposit=parseInt(resp.max_deposit);
           this.min_withdraw=parseInt(resp.min_withdraw);
           this.max_withdraw=parseInt(resp.max_withdraw);
           // localStorage.setItem("balance",  this.balance); 

        }
        else{
         // this.toaster.warning_presentToast(resp.message);
          this.trans_msg=true;
          this.trans_msg_exist=this.translate.instant(resp.message);
          this.bonus_balance = resp.balance.bonus_balance;
         this.deposit_balance = resp.balance.deposit_balance;
         // this.user.wallet_balance = this.deposit_balance
         this.winning_balance = resp.balance.winning_balance;
         this.affiliate_balance = resp.balance.affiliate_balance;
          this.affiliate_is = resp.balance.affiliate;
         this.min_deposit=parseInt(resp.min_deposit);
         this.max_deposit=parseInt(resp.max_deposit);
         this.min_withdraw=parseInt(resp.min_withdraw);
         this.max_withdraw=parseInt(resp.max_withdraw);
         // this.amountForm.amount.
          // localStorage.setItem("balance",  this.balance); 
        }

       
    },(err)=>{

      this.errorService.errorsMethod(err)
      this.loading_.dismissLoading();
    })
  }

  async addAmountData(){
    this.summary_div = false;
    this.transactions_div = false;
    this.addAmount_div=true;
    this.addBank_div =false;
    this.withdraw_div = false;
    this.user.check_deposit_status().subscribe((resp:any) => {
      if(resp.code==4){
        this.error_msg = this.translate.instant(resp.message);
      }
    })
    
  }

  //withdaw form

 async withdrawalSubmit(){
      this.submitted = true;
      var msg;

       
       this.touched_withdrawalForm=true;
        // stop here if form is invalid
        if(this.valid_fun('withdrawal_amount') != '')
        {
          return;
        }else if(this.valid_fun('withdrawal_bank_name') != '')
        {
          return;
        }
         else
       
        {
          this.loading_.presentLoading();
          this.user.addWithdraw(this.withdrawalForm).subscribe((resp:any) => { 
            // code5: For checking whether user done his kyc or not
            this.touched_withdrawalForm=false;
            this.loading_.dismissLoading();
                if(resp.code == 5)
                  {
                    
                    this.toaster.warning_presentToast(this.translate.instant(resp.message));
                    this.navCtrl.navigateForward('/upload-docs');
                  }
                // code4:For error messages and no data messages
                else if(resp.code == 4){
                  if(resp.time_or_limit != "" && resp.time_or_limit != null){
                    this.user.presentfailAlert(this.translate.instant(resp.message) +" "+resp.time_or_limit,'<ion-img src="assets/imgs/warning.png">');
                    return;
                  }
                  this.user.presentfailAlert(this.translate.instant(resp.message),'<ion-img src="assets/imgs/warning.png">');
                 // this.user.presentsuccessAlert(resp.message);
                }
                else if(resp.code == 16){
                  // this.PAN_required = true;
                  this.user.presentfailAlert(this.translate.instant(resp.message),'<ion-img src="assets/imgs/warning.png">');
                  this.navCtrl.navigateForward('/upload-docs');
                  // this.upload_PAN(resp);
                  return;
                } 
                else if(resp.code == 17){
                  this.user.presentfailAlert(this.translate.instant(resp.message),'<ion-img src="assets/imgs/ant_loading_profile.gif">');
                  return;
                } 
                else if(typeof(resp)== 'object')
                {
                  this.confirm_withdraw(resp.amount,resp.nick_name,resp.fee);
                }
                else
                 {
                   this.user.presentfailAlert(this.translate.instant(resp.message),'<ion-img src="assets/imgs/warning.png">');
                  // this.user.presentsuccessAlert(resp.message);  
              }
            },(err)=>{
              this.loading_.dismissLoading();
               this.errorService.errorsMethod(err)
            })
        }
    }


    // PAN Card Upload
    async upload_PAN(resp:any){
      var  ok_btn = this.translate.instant('UPLOAD')
      var rejected_reason ='';
      if(resp.rejected_reason != null){
        ok_btn = this.translate.instant('REUPLOAD');
        rejected_reason =this.translate.instant(resp.rejected_reason);

      }
      
      const alert = await this.alertController.create({
      header: this.translate.instant('PAN_REQUIRED'),
      message: this.translate.instant(resp.message)+' '+rejected_reason,     
        buttons: [
        {
          text: this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: ok_btn,
          handler: () => {
            this.proof_doc();
          }
        }
      ]
      })
      await alert.present();

    }

    //add money form

  amountSubmit(amount){
    
      this.submitted = true;
      this.touched_amountForm = true;
      this.openPayments(amount);
      this.touched_amountForm = false;
     // if(this.valid_fun('amount') !=''){
     //   return;
     // }
     //  this.touched_amountForm = false;
    }
    async openPayments(amount)
  {

     const modal = await this.modalController.create({
       component: PaymentModalPage,
       componentProps:{ 'amount' : amount }
     });
     modal.onDidDismiss().then(() => {
          this.segmentChanged('Transactions'); 
     });
     
     return await modal.present();
 
  }



  addBankData()
  {
    this.user.get_bank_account().subscribe((resp:any)=>{
      if(resp.code==0){
        this.mybank = resp.bank_account;
        this.addBank_div =false;
        this.bankList_div =true;
      }else{
        this.bankList_div =false;
        this.addBank_div =true;
      }
      console.log(resp);
    },err=>{
      this.errorService.errorsMethod(err);
    })
    this.summary_div = false;
    this.transactions_div = false;
    this.addAmount_div=false;
    
    this.withdraw_div = false;
  }

  //add bank form


async proof_doc() {

    let actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant('SELECT_PICTURE'),
      buttons: [
        {
          text: this.translate.instant('GALLERY'),
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: this.translate.instant('CAMERA'),
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel'
        }
      ]
    });
   await actionSheet.present();
  }
 async getPicture(sourceType) {
   
    if(isCordovaAvailable())
  {
    var option_cum:any = { 
      destinationType: this.camera.DestinationType.FILE_URI,   
      quality: 70,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true, };
      this.camera.getPicture(option_cum).then((imageData) => {
         this.base64.encodeFile(imageData)
         .then((base64File: string) => {
           console.log(base64File);
                var trim_data=base64File.split(',')
                console.log(trim_data[1])
              this.loading_.presentLoading();
             this.file.resolveLocalFilesystemUrl(imageData)
                 .then(fileEntry => { 
                   fileEntry.getMetadata((metadata) => { 
                     //metadata.size is the size in bytes
                     if((metadata.size) > 2000000){
                       this.loading_.dismissLoading();
                       this.bank_passbook_err_msg = this.translate.instant('SELECT_DOC_LESS_THAN_2MB');
                       if(this.PAN_required){
                         this.toaster.warning_presentToast(this.translate.instant('SELECT_DOC_LESS_THAN_2MB'))
                       }
                       return false;
                     }
                     else{
                       this.loading_.dismissLoading();
                        this.proof.base64 ='data:image/jpg;base64,'+trim_data[1];
                        this.proof.filename=imageData.substr(imageData.lastIndexOf('/') + 1);
                        this.bank_passbook_err_msg = '';
                        if(this.PAN_required){
                          this.loading_.presentLoading();
                          this.PAN_required = false;
                          var data ={pan_card:{base64:this.proof.base64,filename:this.proof.filename}}
                          this.user.upload_pan_card(data).subscribe((resp:any) => {
                            this.loading_.dismissLoading();
                            if(resp.code == 4){
                              // this.bank_passbook_err_msg = this.translate.instant(resp.message);
                             this.toaster.warning_presentToast(this.translate.instant(resp.message));
                             return;
                            }
                              this.bank_passbook_err_msg = '';
                              this.user.presentsuccessAlert(this.translate.instant(resp.message))
                          },err=>{
                            this.loading_.dismissLoading();
                            this.errorService.errorsMethod(err)
                          })

                        }else{
                          this.bankUpload=true;
                        }
                        
                     }
                         } )
                       })
            }, (err) => {
              this.loading_.dismissLoading();
                console.log(err);
              });
       }, (err) => {
          this.loading_.dismissLoading();
         if(err == 'No Image Selected')
          {
            this.bank_passbook_err_msg = this.translate.instant('SELECT_IMAGE_TYPE');
            if(this.PAN_required){
            this.toaster.warning_presentToast(this.translate.instant('SELECT_IMAGE_TYPE'))  
            }
            
          }
         
      })
    
  }
  else{
    this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
  }
}
  bankSubmit(){
      this.submitted = true;
      this.touched_bankForm = true;
        
        if (this.bankForm.valid) {
          if(this.proof.base64==''){
            this.bank_passbook_err_msg = this.translate.instant('BANK_PASSBOOK');
            return false;
          }
          this.bankconfirmation();
        }
  }

  // bank adding confirmation

    async bankconfirmation() {

    

    const alert = await this.alertController.create({
      header:this.translate.instant('CONFIRMATION'),
      message: this.translate.instant('BANK_ADD_ALERT'),
      buttons: [
        {
          text:  this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.translate.instant('YES'),
          handler: () => {
            this.loading_.presentLoading();
          this.touched_bankForm = false;
          this.user.addBank(this.bankForm,this.proof).subscribe((resp:any) => {
            this.loading_.dismissLoading();
          // code5: For checking whether user done his kyc or not 
            if(resp.code == 5)
                {
                  
                  this.bankUpload=false;
                  this.bankForm.reset();
                  this.toaster.warning_presentToast(this.translate.instant(resp.message));
                  this.navCtrl.navigateForward('/upload-docs');
                }
              // code4:For error messages and no data messages
              else if(resp.code == 4){
                
                this.bankUpload=false;
                this.bankForm.reset();
               this.toaster.warning_presentToast(this.translate.instant(resp.message));
               
              }  
            else{
              // this.toaster.warning_presentToast(this.toasters[28].title);
              this.user.presentsuccessAlert(this.translate.instant(resp.message))
              this.bankUpload=false;
              this.repeatingDaily(this.translate.instant(resp.message))
               this.bonus_balance = resp.bonus_balance;
               this.deposit_balance = resp.deposit_balance;
               // this.user.wallet_balance = this.deposit_balance
               this.winning_balance = resp.winning_balance;
                        
               this.nobanks=false;
              this.bankForm.reset();

            }
           },(err)=>{
             this.loading_.dismissLoading();   
              
              this.errorService.errorsMethod(err)
            })
          }
        }
      ]
    });
    await alert.present();
  }


     //withdraw bank list
  async withdrawData()
  {

    this.loading_.presentLoading();
    this.summary_div = false;
    this.transactions_div = false;
    this.addAmount_div=false;
    this.addBank_div =false;
    this.withdraw_div = true;

   
    this.user.getWithdrawBanks().subscribe((resp:any) => {  
      // code5: For checking whether user done his kyc or not
      this.loading_.dismissLoading();
        if(resp.code == 5)
        {
         // this.toaster.warning_presentToast(resp.message);
         
         if(resp.upload_status == false)
         {
           this.navCtrl.navigateForward('upload-docs');
         }
         this.form=false;
         // else if(resp.bank_accounts.length < 1){
         //   this.form=false;
         // }
         return false;
        }
        // code4:For error messages and no data messages
          if(resp.code == 4){
           this.toaster.warning_presentToast(this.translate.instant(resp.message));
          } 
        //code6:For checking whether user bank accounts are verified or not
          else if(resp.code == 6)
          {
            // this.toaster.warning_presentToast(this.translate.instant(resp.message));
           this.nobanks_text=this.translate.instant(resp.message);
           this.nobanks=true;
          }
          else if(typeof(resp)=='object'){
            this.form=true;
            this.mybanks=resp.bank_accounts;
            this.fee=JSON.parse(resp.withdraw_fee);
            this.bonus_balance = resp.bonus_balance;
            this.deposit_balance = resp.deposit_balance;
            // this.user.wallet_balance = this.deposit_balance
            this.winning_balance = resp.winning_balance;
            this.min_withdraw=parseInt(resp.min_withdraw);
            this.max_withdraw=parseInt(resp.max_withdraw);
            this.nobanks=false;
           }
          else
          {
            this.nobanks_text=this.translate.instant(resp);
            this.nobanks=true;
          }
       
    },(err)=>{
        this.loading_.dismissLoading();

      this.errorService.errorsMethod(err)
    })
    
  }

  //withdraw history

  async  getwthdrw_hist(){
   this.loading_.presentLoading();
    this.year=this.myDate.getFullYear()
    this.month=this.myDate.getMonth()
    this.year = this.year-1
    this.month=this.month+1
    this.startDate= this.year +'/'+this.month+'/'+ this.myDate.getDate()
    this.endDate= this.myDate.getFullYear() +'/'+ this.month+'/'+ this.myDate.getDate()
    localStorage.setItem('startDate',this.startDate)
    localStorage.setItem('endDate',this.endDate)

    this.withdrawpage=1
    var account=
        {
          page:this.withdrawpage,
          startDate:this.startDate,
          endDate:this.endDate
        }
        this.user.getWithdraws(account).subscribe((resp:any) => {
          this.loading_.dismissLoading();
          // code5: For checking whether user done his kyc or not
        if(resp.code == 5)
          {
            
            this.toaster.warning_presentToast(this.translate.instant(resp.message));
            this.navCtrl.navigateForward('/upload-docs');
          }
        // code4:For error messages and no data messages
        else if(resp.code == 4){
            this.toaster.warning_presentToast(this.translate.instant(resp.message));
         
         
        }         
        else if(resp.message != undefined){
         
         // this.toaster.warning_presentToast(resp.message);
         this.with_msg=true;
          this.with_msg_exist=this.translate.instant(resp.message);
          this.bonus_balance = resp.bonus_balance;
         this.deposit_balance = resp.deposit_balance;
         // this.user.wallet_balance = this.deposit_balance
         this.winning_balance = resp.winning_balance;
         
          // localStorage.setItem("balance",  this.balance);     

        }
        else
        {
          this.with_msg=false;
          this.withdrawpage=this.withdrawpage+1;
          this.cpy_withdraws=resp.withdraws;
          this.bonus_balance = resp.bonus_balance;
         this.deposit_balance = resp.deposit_balance;
         // this.user.wallet_balance = this.deposit_balance
         this.winning_balance = resp.winning_balance;
         
           // localStorage.setItem("balance",  this.balance); 
        }
    },(err)=>{
       this.errorService.errorsMethod(err)
       this.loading_.dismissLoading();

    })
  }
  //confirmation of withdrawl

  async confirm_withdraw(amount,nick_name,fee){
  const alert = await this.alertController.create({
      header: this.translate.instant('ARE_YOU_SURE'),
      message: this.translate.instant('WITHDRAW_CONFIRM_ALERT')+' Rs:' + amount+' '+this.translate.instant('FROM')+' '+ nick_name+' '+'with Fee  '+'Rs:'+fee+'/-',
      
      buttons: [
        {
          text:  this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        },{
          text: this.translate.instant('OK_BUTTON'),
          handler: (data) => {

          this.user.confirmWithdraw(this.withdrawalForm).subscribe((resp:any) => {
            // code5: For checking whether user done his kyc or not
          if(resp.code == 5)
          {
            this.toaster.warning_presentToast(this.translate.instant(resp.message));
            this.navCtrl.navigateForward('/upload-docs');
          }
          // code4:For error messages and no data messages
          else if(resp.code == 4){
          
            this.toaster.warning_presentToast(this.translate.instant(resp.message));
        }
        else{
          this.user.presentsuccessAlert(this.translate.instant(resp.message));
          this.repeatingDaily(this.translate.instant(resp.message));
          this.bonus_balance = resp.bonus_balance;
          this.deposit_balance = resp.deposit_balance;
          // this.user.wallet_balance = this.deposit_balance
          this.winning_balance = resp.winning_balance;
          this.withdrawalForm.reset();
          this.addWithdrawif=false;
        }
        },(err)=>{
           this.errorService.errorsMethod(err)
        })
            
          }
        }
      ]
    });

    await alert.present();
}
  addForm()
  {
    this.getwthdrw_hist();
    this.addWithdrawif=true;
     
  }

  witForm()
  {
    this.addWithdrawif=false;
     
  }
  cancelWithdraw(id)
  {
       
       this.cancel_id=id
       this.cancelwithdrawal();
   }

   
  account()
  {
        this.navCtrl.navigateForward('bankaccounts');

  }

    //cancel withdraw
     
  async cancelwithdrawal() {
    
    const alert = await this.alertController.create({
      header:this.translate.instant('ARE_YOU_SURE'),
      message: this.translate.instant('CANCEL_WITHDRAW_ALERT'),
      buttons: [
        {
          text:  this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.translate.instant('YES'),
          handler: () => {
            this.loading_.presentLoading();
            this.user.cancel_Withdraw(this.cancel_id).subscribe((resp:any) => {
            // code5: For checking whether user done his kyc or not  
            this.loading_.dismissLoading();
              if(resp.code == 5)
                {
                  
                  this.toaster.warning_presentToast(this.translate.instant(resp.message));
                  this.navCtrl.navigateForward('/upload-docs');
                }
              // code4:For error messages and no data messages
              else if(resp.code == 4){
               this.toaster.warning_presentToast(this.translate.instant(resp.message));
               
              }  
              else{ 
                 this.user.presentsuccessAlert(this.translate.instant(resp.message));
                 this.repeatingDaily(this.translate.instant(resp.message));
                 this.bonus_balance = resp.bonus_balance;
                 this.deposit_balance = resp.deposit_balance;
                 // this.user.wallet_balance = this.deposit_balance
                 this.winning_balance = resp.winning_balance;
                 this.getwthdrw_hist();
                 
               }
          },(err)=>{
            this.loading_.dismissLoading();
                this.errorService.errorsMethod(err)

    })
     
        }
      }
      ]
    });
    await alert.present();
  }

  


//Local notifications
   repeatingDaily(data) 
   {
   if(isCordovaAvailable()) 
      {
        // console.log("hello")
           this.localNotifications.schedule({
            id: 1,
           title: this.translate.instant('NOTIFICATION'),
           text: data,
           //data: { mydata: data },
           trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
           foreground: true // Show the notification while app is open
         });
      }
 
  }

//filter options

  filter_alert()
   {
        if (this.transactionfilter.invalid) 
          {
          
          if(this.transactionfilter.get('start_date').hasError('required'))

            {
              this.toaster.warning_presentToast(this.translate.instant('START_DATE_REQ'))
            }
            else if (this.transactionfilter.get('end_date').hasError('required'))
            {
                this.toaster.warning_presentToast(this.translate.instant('END_DATE_REQ'))
            }
           }
           else
            {
              this.filterpage=1;
              var account=
                 {
                page:this.filterpage,
                startDate:this.transactionfilter.value.start_date,
                  endDate:this.transactionfilter.value.end_date
                   }
                 localStorage.setItem('startDate',account.startDate)
                 localStorage.setItem('endDate',account.endDate)  

                 this.startDate=localStorage.getItem('startDate') ;
                 this.endDate=localStorage.getItem('endDate');

               this.user.getTransactions(account).subscribe((resp:any) => {
                 // code5: For checking whether user done his kyc or not
                  if(resp.code == 5)
                    {
                      this.toaster.warning_presentToast(this.translate.instant(resp.message));
                      this.navCtrl.navigateForward('/upload-docs');
                    }
                  // code4:For error messages and no data messages
                  else if(resp.code == 4){
                   this.toaster.warning_presentToast(this.translate.instant(resp.message));
                  }   
                  if(resp.message  != undefined)
                  {
                    // this.toaster.warning_presentToast(resp.message);
                    this.trans_msg=true;
                    this.trans_msg_exist=this.translate.instant(resp.message);
                    this.cpy_trasctions=resp.transactions;
                    this.transactionfilter.reset();
                    this.filtertransactions=false;
                  }
                  else
                  {  
                   this.trans_msg=false;
                   this.cpy_trasctions=resp.transactions;
                   this.bonus_balance = resp.balance.bonus_balance;
                   this.deposit_balance = resp.balance.deposit_balance;
                   // this.user.wallet_balance = this.deposit_balance
                   this.winning_balance = resp.balance.winning_balance;
                   this.affiliate_balance = resp.balance.affiliate_balance;
           this.affiliate_is = resp.balance.affiliate;
                   this.filterpage=this.filterpage+1;
                   this.transactionfilter.reset();
                   this.filtertransactions=false;
                  }

          },(err)=>{
            this.errorService.errorsMethod(err)
               })
            }
            
   
         }
 
 filter()
   {
     this.filtertransactions=true;
   }
 cancel()
 {
   this.filtertransactions=false;
 }


filter_withdraw_alert()
   {
        if (this.withdrawfilter.invalid) 
          {
          
          if(this.withdrawfilter.get('start_date').hasError('required'))

            {
              this.toaster.warning_presentToast(this.translate.instant('START_DATE_REQ'))
            }
            else if (this.withdrawfilter.get('end_date').hasError('required'))
            {
                this.toaster.warning_presentToast(this.translate.instant('END_DATE_REQ'))
            }
           }
           else
            {
              this.withdrawpage=this.withdrawpage=1
              var account=
                 {
                page:this.withdrawpage,
                startDate:this.withdrawfilter.value.start_date,
                endDate:this.withdrawfilter.value.end_date
                   }
                 localStorage.setItem('startDate',account.startDate)
                 localStorage.setItem('endDate',account.endDate)  

                 this.startDate=localStorage.getItem('startDate') ;
                 this.endDate=localStorage.getItem('endDate');
                 
        this.user.getWithdraws(account).subscribe((resp:any) => { 
          // code5: For checking whether user done his kyc or not
          if(resp.code == 5)
                {
                  this.toaster.warning_presentToast(this.translate.instant(resp.message));
                  this.navCtrl.navigateForward('/upload-docs');
                }
              // code4:For error messages and no data messages
          else if(resp.code == 4){
               this.toaster.warning_presentToast(this.translate.instant(resp.message));
              }         
          if(resp.message != undefined)
             {
               this.with_msg=true;
               this.with_msg_exist=this.translate.instant(resp.message);
               this.cpy_withdraws=resp.withdraws;
               // this.toaster.warning_presentToast(resp.message);
                  this.bonus_balance = resp.bonus_balance;
               this.deposit_balance = resp.deposit_balance;
               // this.user.wallet_balance = this.deposit_balance
               this.winning_balance = resp.winning_balance;
                this.filterwithdraws=false;
                this.withdrawfilter.reset();
             }
            else
             {
               this.with_msg=false;
               this.cpy_withdraws=resp.withdraws;
               this.bonus_balance = resp.bonus_balance;
               this.deposit_balance = resp.deposit_balance;
               // this.user.wallet_balance = this.deposit_balance
               this.winning_balance = resp.winning_balance;
               this.filterwithdraws=false;
               this.withdrawfilter.reset();
               this.withdrawpage=this.withdrawpage+1
              } 
           },(err)=>{
             this.errorService.errorsMethod(err)
          })
            }
            
   
         }
 
 filter1()
   {
     this.filterwithdraws=true;
   }
 cancel1()
 {
   this.filterwithdraws=false;
 }


  lazytransactions(event) 
{

this.startDate=localStorage.getItem('startDate')  
this.endDate=localStorage.getItem('endDate') 
  var account=
        {
          page:this.filterpage,
          startDate:this.startDate,
          endDate:this.endDate
        }
          
    setTimeout(() => {
      this.user.getTransactions(account).subscribe((resp:any) => { 
        this.filterpage=this.filterpage+1;
        // code5: For checking whether user done his kyc or not
           if(resp.code == 5)
                {
                  this.toaster.warning_presentToast(this.translate.instant(resp.message));
                  this.navCtrl.navigateForward('/upload-docs');
                }
            // code4:For error messages and no data messages
            else if(resp.code == 4){
               this.toaster.warning_presentToast(this.translate.instant(resp.message));
              }  
            if(resp.message != undefined){
                 // this.trans_msg_exist=true;
              // this.trans_msg=resp;
              // this.toaster.warning_presentToast(resp.message);
              this.bonus_balance = resp.balance.bonus_balance;
             this.deposit_balance = resp.balance.deposit_balance;
             // this.user.wallet_balance = this.deposit_balance
             this.winning_balance = resp.balance.winning_balance;
             this.affiliate_balance = resp.balance.affiliate_balance;
           this.affiliate_is = resp.balance.affiliate;
            }
            else
            {
             this.transactions=resp.transactions;
             this.cpy_trasctions.push(...this.transactions);
             this.bonus_balance = resp.balance.bonus_balance;
             this.deposit_balance = resp.balance.deposit_balance;
             // this.user.wallet_balance = this.deposit_balance
             this.winning_balance = resp.balance.winning_balance;
             this.affiliate_balance = resp.balance.affiliate_balance;
           this.affiliate_is = resp.balance.affiliate;
              
            }
               if(resp==null)
                {
                    event.target.disabled = true;
                }

    },(err)=>{
      
     this.errorService.errorsMethod(err)
    })
      event.target.complete();
    }, 500);
  }




  lazywithdraws(event) 
{
   this.startDate=localStorage.getItem('startDate')  
   this.endDate=localStorage.getItem('endDate') 
  var account=
        {
          page:this.withdrawpage,
          startDate:this.startDate,
          endDate:this.endDate
        }
  
        this.user.getWithdraws(account).subscribe((resp:any) => {  
            this.withdrawpage=this.withdrawpage+1;
            // code5: For checking whether user done his kyc or not
            if(resp.code == 5)
            {
              this.toaster.warning_presentToast(this.translate.instant(resp.message));
              this.navCtrl.navigateForward('/upload-docs');
            }
            // code4:For error messages and no data messages
              else if(resp.code == 4){
               this.toaster.warning_presentToast(this.translate.instant(resp.message));
              }  
            if(resp.message != undefined)
             {
               // this.toaster.warning_presentToast(resp.message);
                this.bonus_balance = resp.bonus_balance;
                 this.deposit_balance = resp.deposit_balance;
                 // this.user.wallet_balance = this.deposit_balance
                 this.winning_balance = resp.winning_balance;
             }
            else
             {
                this.withdraws=resp.withdraws;
                this.cpy_withdraws.push(...this.withdraws);
                this.bonus_balance = resp.bonus_balance;
               this.deposit_balance = resp.deposit_balance;
               // this.user.wallet_balance = this.deposit_balance
               this.winning_balance = resp.winning_balance;
              } 
           },(err)=>{
              this.errorService.errorsMethod(err)
          })
        setTimeout(() => {
      event.target.complete();
    }, 500);
  }
  get_level_info(){
    const browser = this.iab.create(environment.web_path+'/staggered-cashbonus','_blank', 'location=yes');
  }

    toggle()
  {
    this.navCtrl.navigateForward("notifications");
  }

change_st($event){

 this.cities=this.all_cities[$event.detail.value];

 }


  valid_fun(filed){
    if(filed == 'amount'){  
      if(!this.amountForm.touched && !this.touched_amountForm){return '';}
      if(this.amountForm.get('amount').hasError('required') || this.amountForm.get('amount').value<1){
        this.amountForm.get('amount').setErrors({serverValidationError: true});
        this.amountForm.get('amount').updateValueAndValidity();
        return this.translate.instant('MONEY_REQUIRED');
      }
      else if(this.amountForm.get('amount').value <this.min_deposit)
      {
        this.amountForm.get('amount').setErrors({serverValidationError: true});
        this.amountForm.get('amount').updateValueAndValidity();
        return this.translate.instant('MINIMUM_AMOUNT')+' ₹'+this.min_deposit;

      }
      else if(this.amountForm.get('amount').value >this.max_deposit)
      {
        this.amountForm.get('amount').setErrors({serverValidationError: true});
        this.amountForm.get('amount').updateValueAndValidity();
        return this.translate.instant('MAXIMUM_AMOUNT')+' ₹'+this.max_deposit;
      }
      this.amountForm.get('amount').setErrors({serverValidationError: false});
      this.amountForm.get('amount').updateValueAndValidity();
        return '';
    }
    if(filed == 'nick_name'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('nick_name').hasError('required')){
        return this.translate.instant('NICK_NAME_REQUIRED');
      }
      else if(this.bankForm.get('nick_name').hasError('minlength'))
      {
        return this.translate.instant('NICK_NAME_MINLENGTH');
      }
      else if(this.bankForm.get('nick_name').hasError('pattern'))
      {
        return this.translate.instant('BANK_NICK_NAME_PATTERN');
      }
      
        return '';
    }
    if(filed == 'holder_name'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('holder_name').hasError('required')){
        return this.translate.instant('HOLDER_NAME_REQUIRED');
      }
      else if(this.bankForm.get('holder_name').hasError('minlength'))
      {
        return this.translate.instant('ACCOUNT_NAME_MINLENGTH');
      }
      else if(this.bankForm.get('holder_name').hasError('pattern'))
      {
        return this.translate.instant('ACCOUNT_NAME_PATTERN');
      }
      
        return '';
    }
    if(filed == 'branch_name'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('branch_name').hasError('required')){
        return this.translate.instant('BRANCH_NAME_REQUIRED');
      }
      else if(this.bankForm.get('branch_name').hasError('minlength'))
      {
        return this.translate.instant('BRANCH_NAME_MINLENGTH');
      }
      else if(this.bankForm.get('branch_name').hasError('pattern'))
      {
        return this.translate.instant('BRANCH_NAME_PATTERN');
      }
      
        return '';
    }
    if(filed == 'account_number'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('account_number').hasError('required')){
        return this.translate.instant('ACCOUNT_NUMBER_REQUIRED');
      }
      else if(this.bankForm.get('account_number').hasError('min'))
      {
        return this.translate.instant('ACCOUNT_NUM_LENGTH');
      }
      else if(this.bankForm.get('account_number').hasError('pattern'))
      {
        return this.translate.instant('ACCOUNT_NUMBER');
      }
      
        return '';
    }
    if(filed == 'bank_name'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('bank_name').hasError('required')){
        return this.translate.instant('BANK_NAME_REQUIRED');
      }
      
        return '';
    }
    if(filed == 'account_type'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('account_type').hasError('required')){
        return this.translate.instant('ACCOUNT_TYPE_REQUIRED');
      }
      
        return '';
    }
    if(filed == 'ifsc_code'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('ifsc_code').hasError('required')){
        return this.translate.instant('IFSC_REQUIRED');
      }
      else if(this.bankForm.get('ifsc_code').hasError('pattern'))
      {
        return this.translate.instant('IFSC_PATTERN');
      }
      
        return '';
    }
    if(filed == 'state_name'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('state_name').hasError('required')){
        return this.translate.instant('STATE_REQUIRED');
      }
      
        return '';
    }
    if(filed == 'city_name'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('city_name').hasError('required')){
        return this.translate.instant('CITY_REQUIRED');
      }
      
        return '';
    }

    if(filed == 'withdrawal_amount'){  
      if(!this.withdrawalForm.touched && !this.touched_withdrawalForm){return '';}
      if(this.withdrawalForm.get('withdrawal_amount').hasError('required') || this.withdrawalForm.get('withdrawal_amount').value<1){
        return this.translate.instant('WITHDRAW_REQUIRED');
      }
      else if(this.withdrawalForm.get('withdrawal_amount').value <this.min_withdraw)
      {
        return this.translate.instant('WITHDRAW_MINIMUM')+' ₹'+this.min_withdraw;
      }
      else if(this.withdrawalForm.get('withdrawal_amount').value >this.max_withdraw)
      {
        return this.translate.instant('WITHDRAW_MAXIMUM')+' ₹'+this.max_withdraw;
      }
        return '';
    }
    if(filed == 'withdrawal_bank_name'){  
      if(!this.withdrawalForm.touched && !this.touched_withdrawalForm){return '';}
      if(this.withdrawalForm.get('bank_name').hasError('required')){
        return this.translate.instant('BANK_NAME_REQUIRED');
      }
      
        return '';
    }

    return '';
  }

  download()
  {
    this.navCtrl.navigateForward('download-statement');
  }

  async follow(data)
{
   this.loading_.presentLoading();

  var postdata={id:data};
  this.user.follow_up(postdata).subscribe((resp:any) => { 

    if(resp.code == 0)
    {
      this.toaster.success_presentToast(this.translate.instant(resp.message));
      this.addBankData();
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