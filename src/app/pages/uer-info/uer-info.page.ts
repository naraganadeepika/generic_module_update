import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router , ParamMap ,ActivatedRoute} from '@angular/router';
import { UserService, ErrorService,ToastersService } from '../../providers';
import { LoadingController,NavController,AlertController } from '@ionic/angular';
import { isCordovaAvailable } from '../../providers/is-cordova-available'
import { environment } from '../../../environments/environment';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
  selector: 'app-uer-info',
  templateUrl: './uer-info.page.html',
  styleUrls: ['./uer-info.page.scss'],
})
export class UerInfoPage implements OnInit {
user_id:any;
user_data:any=[];
recent_matches_comparision:any=[];
playing_history:any=[];
show:boolean=true;
k:any=2;
  constructor(
    private user:UserService,
    public loadingCtrl: LoadingController,
    private activeRoute: ActivatedRoute,
    public nav:NavController,
    public translate: TranslateService,
    private socialSharing: SocialSharing,
    public alertController:AlertController,
    public errorService:ErrorService,
    private toaster:ToastersService,
    ) { 
  }

  

  ngOnInit() {
    this.user_id=this.activeRoute.snapshot.paramMap.get('id');
    this.getUserdetails();
  }
//get the  info of the one you are following
  async getUserdetails()
  {
    const loading = await this.loadingCtrl.create({
      spinner: null,
    }); 
     loading.present();

    this.user.get_user_data(this.user_id).subscribe((resp:any) => {
       loading.dismiss();
       // code4:For error messages and no data messages
       if(resp.code == 4)
       {
         this.toaster.warning_presentToast(this.translate.instant(resp.message));
         return false;
       }
       if(typeof(resp) == 'string')
       {
         this.toaster.warning_presentToast(this.translate.instant(resp))
       }
       else{
         this.user_data=resp.user_info;
         this.playing_history=resp.playing_history;
         this.recent_matches_comparision=resp.recent_matches_comparision;

       }
       
    },(err)=>{
      loading.dismiss();
      this.errorService.errorsMethod(err)
    })
  }
  get_more()
  {
   // this.getUserdetails();
   this.k=this.recent_matches_comparision.length;
   this.show=false;
  }

  get_best_team_score(teamaname,teambname,teama,teamb)
  {
    if(teama != null && teamb != null)
      {
      var score1=teama.split('/');
      var score2=teamb.split('/');
      if(JSON.parse(score1[0])>JSON.parse(score2[0]))
      {
        var total=JSON.parse(score1[0])-JSON.parse(score2[0]);
        return teamaname+' beat '+teambname+' by '+total+' runs'
      }
      else {
        var total=JSON.parse(score2[0])-JSON.parse(score1[0]);
        return teambname+' beat '+teamaname+' by '+total+' runs'
      }
    }
  }


  sharewithOptions(user_name)
  {
    if(isCordovaAvailable())
    {
      // var path=environment.web_path+"/app-invitation ";
      // var path=  this.translate.instant('READY_TO_TRACK')+' '+environment.web_path+'/profile/'+this.user.referral_code+' '+this.translate.instant('TO_START_FOLLOWING');
      var msg=  this.translate.instant('READY_TO_TRACK')+' '+environment.web_path+'/profile/'+user_name+' '+this.translate.instant('TO_START_FOLLOWING');
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

}
