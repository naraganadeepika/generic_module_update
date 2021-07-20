import { Component, OnInit } from '@angular/core';
import { NavController,AlertController,MenuController,LoadingController } from '@ionic/angular';
import { UserService, ErrorService, ToastersService } from '../../providers';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-reenterpin',
  templateUrl: './reenterpin.page.html',
  styleUrls: ['./reenterpin.page.scss'],
})
export class ReenterpinPage implements OnInit {
  constructor(private toaster:ToastersService,public navCtrl: NavController ,public errorService:ErrorService,public loadingCtrl: LoadingController,public menu: MenuController,public alertCtrl: AlertController,public translate: TranslateService,public user:UserService) { 
  }
  public connectedCspList:Array<string> = new Array(); 
res:any = '';

//elements entered will come here
keyclick(ele){
if(this.connectedCspList.length < 6){
  this.connectedCspList.push(JSON.stringify(ele));
   if(this.connectedCspList.length == 6){this.enter();}    
} else {
  // alert('pw max length 5');
}

}

//delete pin

backspace(){
if(this.connectedCspList.length > 0){
  this.connectedCspList.splice(-1);
}
}

 //submit form
 
async enter(){
  const loading = await this.loadingCtrl.create({
       spinner: null,
      message: '',
    }); 
     
  if(this.connectedCspList.length == 6){
    for(var i = 0; i<this.connectedCspList.length; i++ ){
      this.res +=  this.connectedCspList[i];        
    }
    var pin = localStorage.getItem('pin');
    var email = localStorage.getItem('email');
    if(this.res === pin){
      loading.present();
      this.user.pinenter(this.res, email).subscribe((resp:any)=> {
        loading.dismiss();
        this.toaster.success_presentToast(this.translate.instant(resp));
        localStorage.setItem('pinstatus', 'true');
          localStorage.removeItem('pin');
         var enable_2fa = localStorage.getItem('enable_2fa');
          if(enable_2fa === 'true')
          {
          this.presentPrompt();
          }
          else
          {
            this.navCtrl.navigateRoot("home");
          }
          
      }, err =>{
        loading.dismiss();
        this.connectedCspList=[];
        this.errorService.errorsMethod(err)
        this.res='';
      });
    }else {
this.toaster.warning_presentToast(this.translate.instant('PIN_MISMATCH'));
this.res='';
this.connectedCspList=[];
    }
  } else {
this.toaster.warning_presentToast(this.translate.instant('PASSWORD_MINLENGTH'));
this.res='';
this.connectedCspList=[];
  }

}
// alert of google 2fa if enabled

async presentPrompt() {
  let alert = await this.alertCtrl.create({
    header:this.translate.instant('GOOGLE_2FA'),
    inputs: [
      {
        name: 'key',
        placeholder: this.translate.instant('ENTER_KEY')
      }
    ],
    buttons: [
      {
        text: this.translate.instant('CANCEL_BUTTON'),
        role: 'cancel',
        handler: data => {
        }
      },
      {
        text: this.translate.instant('YES'),
        handler: data => {
          var key= new RegExp(/^[0-9]{6}$/);
             if(data.key == "")
             {
               this.toaster.warning_presentToast(this.translate.instant('KEY_REQUIRED'));
             }
             else if( !key.test(data.key))
             {
               this.toaster.warning_presentToast('Invalid key');
             }
             else{
               var email=localStorage.getItem('email');
               this.user.verifykey(email,data.key).subscribe((resp:any) => {
                this.navCtrl.navigateRoot("home");
               },(err)=>{
                  this.errorService.errorsMethod(err)
               });
             }
         
        }
      }
    ]
  });
  await alert.present();
}
//side menu disabled before login
ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  ngOnInit() {
  }

}
