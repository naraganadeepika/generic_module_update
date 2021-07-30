import { Component, OnInit } from '@angular/core';
import { NavController,AlertController,MenuController } from '@ionic/angular';
import { UserService, ErrorService, ToastersService } from '../../providers';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-submitpin',
  templateUrl: './submitpin.page.html',
  styleUrls: ['./submitpin.page.scss'],
})
export class SubmitpinPage implements OnInit {
  constructor(public navCtrl: NavController ,
    private activeRoute: ActivatedRoute,
    public menu: MenuController,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public user:UserService, 
    public errorService:ErrorService,
    private toaster:ToastersService,
   
    ) {
    const queryParams = this.activeRoute.snapshot.queryParams;
    
    this.returnUrl = queryParams.returnUrl;
    console.log(this.returnUrl);
    if(this.returnUrl==undefined){
      this.returnUrl = 'home';
    }
    
   }
  public connectedCspList:Array<string> = new Array(); 
  res:any = '';
  private returnUrl:any;


 //pin entered

keyclick(ele){
if(this.connectedCspList.length < 6){
  this.connectedCspList.push(JSON.stringify(ele));
  if(this.connectedCspList.length == 6)
  {this.enter();  }
  
} else {
}

}

//delete pin

backspace(){
if(this.connectedCspList.length > 0){
  this.connectedCspList.splice(-1);
}
}

//submit pin

enter(){
  if(this.connectedCspList.length == 6){
    for(var i = 0; i<this.connectedCspList.length; i++ ){
      this.res +=  this.connectedCspList[i];        
    }
    var email = localStorage.getItem('email');

      this.user.pinsubmit(this.res, email).subscribe((resp:any)=> {
         
         if(resp.code==4){
           this.toaster.warning_presentToast(this.translate.instant(resp.message));
           this.res='';
           this.connectedCspList=[];
             
         }else{

          localStorage.setItem('token', JSON.stringify(resp.jwt));
          // localStorage.setItem('enable_2fa',resp.session.enable_2fa);
          var enable_2fa = localStorage.getItem('enable_2fa');
          // this.user.username = resp.session.user_name;
          // localStorage.setItem('username',resp.session.user_name);
              if(enable_2fa === 'true')
              {
              this.presentPrompt();
              }
              else
              {
               this.navCtrl.navigateRoot(this.returnUrl);
              } 
          }           
          
      }, (err) =>{
        this.connectedCspList=[];
        this.errorService.errorsMethod(err)
        this.res='';
      });
    
  } else {
    this.user.presentfailAlert(this.translate.instant('PASSWORD_MINLENGTH'),'<ion-img src="assets/imgs/warning.png">');
    this.res='';
  }

}



//alert for google 2fa

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
        text: this.translate.instant('OK_BUTTON'),
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
                this.navCtrl.navigateRoot(this.returnUrl);
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

  backLogin()
  {
    localStorage.clear();
    //this.storage.clear();
    localStorage.setItem('tutorialComplete', JSON.stringify(true));
    this.navCtrl.navigateRoot("/");
  }

  //side menu before login

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }


  ngOnInit() {

  }

}
