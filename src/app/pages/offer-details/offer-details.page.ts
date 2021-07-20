import { Component, OnInit } from '@angular/core';
import { Router , ParamMap ,ActivatedRoute} from '@angular/router';
import { NavController } from '@ionic/angular';
import { ErrorService, UserService, LoadingService } from '../../providers';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.page.html',
  styleUrls: ['./offer-details.page.scss'],
})
export class OfferDetailsPage implements OnInit {

coupon_id:any;
summary:any='';
data:any='';
   constructor(
   public user:UserService,
   public activeRoute: ActivatedRoute,
   public loading_:LoadingService,
   public navCtrl:NavController,
   public errorService:ErrorService
   ) { 
     }
  ngOnInit() {
  }
  
  ionViewWillEnter(){
     this.coupon_id=this.activeRoute.snapshot.paramMap.get('id');
     this.get_offer_details_summary();
  }
  //get offer data based ono coupon id
  
  async get_offer_details_summary()
  {
    this.loading_.presentLoading();
  this.user.offer_details_for_coupon(this.coupon_id).subscribe((resp:any) => {
    this.loading_.dismissLoading();
      this.summary=resp.summary;
      this.data=resp.offer_terms_and_conditions;
    
    },(err)=>{
      this.loading_.dismissLoading();
      this.errorService.errorsMethod(err)
    })
  
  }
  toggle()
  {
    this.navCtrl.navigateRoot("notifications");
  }

}
