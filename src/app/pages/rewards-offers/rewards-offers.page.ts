import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController } from '@ionic/angular';
import { UserService, ToastersService, ErrorService } from '../../providers';


@Component({
  selector: 'app-rewards-offers',
  templateUrl: './rewards-offers.page.html',
  styleUrls: ['./rewards-offers.page.scss'],
})
export class RewardsOffersPage implements OnInit {
  type:any;
  page:any=1;
  coupons_data=[];
  inactive_coupons=[];
  active_coupons=[];
  no_coupons:boolean=false;

  constructor(
              public nav:NavController,
              public user:UserService,
              public loadingCtrl: LoadingController,
              public errorService:ErrorService,
              private toaster:ToastersService,
    ) {}

  
  ngOnInit() {

   
  }
//Tabs change method

  segmentChanged(ev: any){
    this.type = ev.detail.value;
     if(this.type=='my'){
          this.my_coupons();
       }
       else if(this.type=='get'){
          this.get_coupons();
    }
   
  }

  get_coupons(){

  }
//getting my coupons data

  async my_coupons(){
    this.page=1;
     const loading = await this.loadingCtrl.create({
      spinner:null
    }); 
     loading.present();

      this.user.get_all_coupons(this.page).subscribe((resp:any) => {
       if(resp.message != null && resp.message != '')
        {
          this.no_coupons=true;
          loading.dismiss();
        }
       else
        {
         this.no_coupons=false;
         this.coupons_data=resp;
         this.active_coupons=resp.active_coupons;
         this.inactive_coupons=resp.inactive_coupons;
         loading.dismiss();
       }
     },(err)=>{
      loading.dismiss();
      this.errorService.errorsMethod(err)
      
    })
  }
//pagination for coupons

  loadCouponsData(event)
   {
     setTimeout(() => {
                 this.page=this.page+1;
                 this.user.get_all_coupons(this.page).subscribe((resp:any) => {
                 if(typeof(resp)!='string'){
                  this.coupons_data.push(...resp);
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
  toggle()
  {
    this.nav.navigateForward("notifications");
  }

 
  coupon()
  {
    this.nav.navigateRoot('get-coupons');
  }

  
 help()
  {
    this.toaster.warning_presentToast('This functionality is currently not available')
  }
  //inside tutorial


}
