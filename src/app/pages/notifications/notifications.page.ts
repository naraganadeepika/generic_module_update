import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  
  myDate: any = new Date();
  year:any= new Date();
  month:any=new Date();
  older:any=[];
  today:any=[];
  coupons:any=[];
  value:any='notes';
  offers:any=[];
  page:any=1;
  no_off:any;
  no_cou:any;
  no_older:any;
  no_tdy:any;
  coupons_count:any;notifications_count:any;offers_count:any;
  no_notification:boolean=false;
  no_notification_message:string
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
    private nav:NavController,
    private alertCtrl:AlertController,
    private loadingCtrl:LoadingController
    ) { }

  ionViewWillEnter()
  {
    // this.notifications();  
    this.show_list_sigm('notes');
  }
  ngOnInit() {
    // this.notifications();
    // this.show_list_sigm('notes');
  }
  //navigate based on type
  goto_page(type)
  {
    if(type == "offers_and_rewards")
    {
      this.nav.navigateForward('rewards-offers');
    }
    else if(type == "wallet")
    {
      this.nav.navigateForward('/wallet');
    }
    else if(type == "home")
    {
      this.nav.navigateForward('/home');
    }
    else if(type == "profile")
    {
      this.nav.navigateForward('profile');
    }
  }
 //Tabs change method for notifications, offers and coupons

  segmentChanged(ev: any) {
    this.page=1;
    this.show_list_sigm(ev.detail.value);

  }
  show_list_sigm(value){
       if(value=='notes'){
          this.notifications();
       }
       else if(value=='offers'){
          this.get_offers();
    }
    else if(value=='coupons'){
          this.get_coupons();
   }
   
  }
  //get notifications data

  async notifications()
  {
    this.loading_.presentLoading();

    this.user.getNotes(this.page).subscribe((resp:any) => { 
       this.loading_.dismissLoading();

        if(resp.code == 0)
        {
          // loading.dismiss();

          this.today=resp.today;
          this.older=resp.older;
          this.coupons_count=resp.coupons_count;
          this.notifications_count=resp.notifications_count;
          this.offers_count=resp.offers_count;
          if(this.today.length > 0)
          {
           this.no_tdy=true;
          }
          else {
            this.no_tdy=false;
          }
          if(this.older.length > 0)
          {
            this.no_older=true;
          }
          else {
            this.no_older=false;
          }
        }else if(resp.code==25)
         {
           this.no_notification=true;
           this.no_notification_message=this.translate.instant(resp.message);
         }else{
          this.older=[];
         this.today=[];
         this.no_older=false;
         this.no_tdy=false;
        }

    },(err)=>{
      this.errorService.errorsMethod(err);
       this.older=[];
         this.today=[];
         this.no_older=false;
         this.no_tdy=false;
      this.loading_.dismissLoading();
    })
  }
 //get offers data

 async  get_offers()
   {
     this.page=1;
     this.loading_.presentLoading();

      this.user.get_offers(this.page).subscribe((resp:any) => {
       this.loading_.dismissLoading();
       if(resp.code == 4){
         // this.user.presentToast(this.translate.instant(resp.message));
        }else if(resp.code == 5){
         // this.user.presentToast(this.translate.instant(resp.message));
         this.offers=[];
        }    
        // code4:For error messages and no data messages       
        else if(typeof(resp)=='string')
        {
          // this.user.presentToast(resp);
          this.no_off = false;
       }
        else
        {

         this.offers=resp.offers;
         this.coupons_count=resp.coupons_count;
          this.notifications_count=resp.notifications_count;
          this.offers_count=resp.offers_count;
         if(this.offers.length > 0){
              this.no_off = true;
         }else {
           this.no_off = false;
         }
        
       }

        
     },(err)=>{
      this.loading_.dismissLoading();
      this.errorService.errorsMethod(err)
      
    })
   }
//get coupons data

   async  get_coupons()
   {
     this.page=1;
     this.loading_.presentLoading();

      this.user.get_coupons(this.page).subscribe((resp:any) => {
        // code4:For error messages and no data messages
       if(resp.code == 4){
         // this.user.presentToast(this.translate.instant(resp.message));
         // loading.dismiss();
        }   
        else if(resp.code == 5){
         // this.user.presentToast(this.translate.instant(resp.message));
         this.coupons=[];
        }         
        else if(typeof(resp)=='string')
        {
          // this.user.presentToast(resp);
          this.no_cou=false;
          // loading.dismiss();
       }
        else
        {
         this.no_cou=true;
         this.coupons=resp.coupons;
         this.coupons_count=resp.coupons_count;
          this.notifications_count=resp.notifications_count;
          this.offers_count=resp.offers_count;
         // loading.dismiss();
       }
       this.loading_.dismissLoading();
     },(err)=>{
      this.loading_.dismissLoading();
      this.errorService.errorsMethod(err)
      
    })
   }
//pagination for notifications

   loadData(event){
         setTimeout(() => {
                    this.page=this.page+1;
                   this.user.getNotes(this.page).subscribe((resp:any) => {
                 if(typeof(resp)!='string'){
                  this.today.push(...resp.today);
                  this.older.push(...resp.older);
                 }else{
                   // this.user.presentToast(resp)
                 }
               },(err)=>{
                   this.errorService.errorsMethod(err)
                   
                 })
               // console.log('Done');
               event.target.complete();
             }, 500);
       }
//pagination for Offers

   loadOffersData(event)
   {
     setTimeout(() => {
                 this.page=this.page+1;
                 this.user.get_offers(this.page).subscribe((resp:any) => {
                 if(typeof(resp)!='string'){
                  this.offers.push(...resp);
                 }else{
                   // this.user.presentToast(resp)
                 }
               },(err)=>{
                   this.errorService.errorsMethod(err)
                   
                 })
               // console.log('Done');
               event.target.complete();
             }, 500);
   }
//pagination for coupons

   loadCouponsData(event)
   {
     setTimeout(() => {
                 this.page=this.page+1;
                 this.user.get_coupons(this.page).subscribe((resp:any) => {
                 if(typeof(resp)!='string'){
                  this.coupons.push(...resp);
                 }else{
                   // this.user.presentToast(resp)
                 }
               },(err)=>{
                  this.errorService.errorsMethod(err)
                   
                 })
               // console.log('Done');
               event.target.complete();
             }, 500);
   }
  //reload page 

  async doRefresh(refresher) {
      this.loading_.presentLoading();

    setTimeout(() => {
      
     this.notifications();
     this.loading_.dismissLoading();
      refresher.target.complete();
    }, 2000);
  }
}
