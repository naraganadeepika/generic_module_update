import { Component, OnInit } from '@angular/core';
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
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.page.html',
  styleUrls: ['./friends-list.page.scss'],
})
export class FriendsListPage implements OnInit {
  earned:any=0;
  to_be_earned:any=0;
  friends:any=[];
  friends_count:any=0;
  total_received:any=0;
  to_be_received_total:any=0;
  enable_msg:boolean=true;
  show_msg:boolean=false;
  need_to_join:any=0;
  my_referrals_message:any ='';
  err_msg:any ='';
  constructor(
    public user:UserService,
    private iab: InAppBrowser,
    private errorService: ErrorService,
    public translate: TranslateService,
    private loading_:LoadingService,
    public menu: MenuController,
    private toaster:ToastersService,
    private alert_: AlertsService,
    private navCtrl:NavController,
    private alertCtrl:AlertController,
    private loadingCtrl:LoadingController,
    private socialSharing: SocialSharing,
    ) { }

//get the friends joined 

  async ngOnInit() {
    this.loading_.presentLoading();

    this.user.getFriends().subscribe((resp:any) => { 
       // code4:For error messages and no data messages
       this.err_msg = '';
        if(resp.code == 4){
          this.friends =[];
          this.err_msg = this.translate.instant(resp.message)
          this.my_referrals_message = resp.my_referrals_message;
         // this.user.presentToast(this.translate.instant(resp.message));
         this.loading_.dismissLoading();
        }           
        
        else
        {
          this.my_referrals_message = resp.my_referrals_message;
          this.earned=resp.earned;
          this.to_be_earned=resp.to_be_earned;
          this.friends=resp.users;
          this.friends_count=resp.joined;
          this.need_to_join=resp.need_to_join;
          this.loading_.dismissLoading();
        }

    },(err)=>{
      this.loading_.dismissLoading();
      this.errorService.errorsMethod(err)
      
    })



  }
//progress bar displaying earned amount and to be earned variation

  fill_processBar(count,total){
    if(count == 100 && total == 0)
    {
      return 100
    }
    else{
      var process =(count*100)/total;
      return process
    }
  }

  fill(earned,to_be_earned)
  {
    if((earned != null && earned != ''))
    {
      var x= JSON.parse(earned)+JSON.parse(to_be_earned);
      return (earned/x) *100
    }
    else{
      return 0
    }
  }
  dismiss()
  {
    this.enable_msg=false;
  }
//share via options(gmail,whatsapp,messaging)

  sharewithOptions()
  {
    if(isCordovaAvailable())
    {
      var path=environment.web_path+"/app-invitation ";
      var msg=this.translate.instant('SHARE_MSG1')+" "+path+" "+this.translate.instant('SHARE_MSG2')+' " '+this.user.referral_code+' " '+this.translate.instant('SHARE_MSG3');
        // Share via email
        this.socialSharing.share(msg,null,null,null).then(() => {
          // Success!
          // alert('success')
        }).catch(() => {
          // Error!
        });
   }
   else{
      this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'))
    }
  }
  help()
  {
    this.toaster.warning_presentToast('This functionality is currently not available')
  }
  info_msg(ev)
  {
    if(ev == true)
    {
      this.show_msg=true;
    }
    else
    {
      this.show_msg=false;
    }
  }
     toggle()
    {
      this.navCtrl.navigateForward("notifications");
    }

}
