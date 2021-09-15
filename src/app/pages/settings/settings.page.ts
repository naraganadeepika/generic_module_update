import { Component, OnInit } from '@angular/core';
import { NavController,AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoadingController } from '@ionic/angular';

import { UserService, ErrorService,ToastersService } from '../../providers/';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FormBuilder,FormControl,Validators, FormGroup } from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { isCordovaAvailable } from '../../providers/is-cordova-available'
import { environment } from '../../../environments/environment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Market } from '@ionic-native/market/ngx';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  lang:string;
  selectedLang:string=localStorage.getItem('LANG')?localStorage.getItem('LANG'):'en';
  version:any;
  key:any;
  google2fa_Form:any;
  val:any;
  data:any;
  setdiv:boolean=true;
  g2fdiv:boolean;
  enabled:any;
  enable_2fa:any;
  bck_codes:any;
  profile_status:any;
  msg:any;
  new_version:any;
  allow:any;
  darkMode: any;
  languages:[];
   selectedLang_txt:any;
  constructor(private navCtrl:NavController,
        private platform: Platform,
        private toaster:ToastersService,
    public formBuilder: FormBuilder,
    public user:UserService,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    public translate: TranslateService,
    private appVersion: AppVersion,
    private clipboard: Clipboard,
    public market:Market,
    private iab: InAppBrowser,
    public errorService:ErrorService

    ) { 
      // this.user.get_settings_data().subscribe((resp:any)=>{
      //   // console.log(resp);
      //   this.allow = resp;
      // },err=>{
      //   // this.errorService.errorsMethod(err);
      // })


    }
  
  // setting the language when there is no default language
  ionViewWillEnter()
  {

    this.user.available_languages().subscribe((resp:any) => {
      this.languages=resp;
      var selectedLang_find= this.languages.find( ({ keyterm }) => keyterm === this.selectedLang );
      this.selectedLang_txt=selectedLang_find['name'];
    });
    if(localStorage.getItem('LANG') != null )
    {
      this.selectedLang = localStorage.getItem('LANG');
    }
    else{
      this.selectedLang = 'en';
    }


  }

  ngOnInit() {

     this.google2fa_Form = this.formBuilder.group({
        key: new FormControl('', Validators.compose([Validators.required,Validators.pattern('^([0-9]{6})+$')]))
        });
     this.enabled=localStorage.getItem('enable_2fa');
     this.enable_2fa=localStorage.getItem('enable_2fa');
     this.profile_status=localStorage.getItem('profile_status');
     this.version =  this.appVersion.getVersionNumber();
  }

  

    //app update check method

 async  appcheck()
  {
    if(isCordovaAvailable())
       {
         this.version =  this.appVersion.getVersionNumber();
         // console.log(this.version)
         // console.log(this.version.__zone_symbol__value);

         const loading = await this.loadingCtrl.create({
           spinner: null,
          message: '',
        }); 
         loading.present();

        this.user.version().subscribe((resp:any) => {
          loading.dismiss();
        if(resp.os=="android")
        {
          this.new_version = resp.android_version;
          // console.log(this.version.__zone_symbol__value);
          if(this.version_check(this.version.__zone_symbol__value,resp.android_version ))
             // console.log(this.version.__zone_symbol__value)
            {
              if(resp.force_update){
                  this.forceUpdate(resp.android_app_url);
                }else{
                  this.AppUPDAte(resp.android_app_url);
                }
               
             
              }
          else{
            this.showAlert(this.translate.instant('APP_UPTO_DATE')+' Version : '+this.version.__zone_symbol__value);
          }
        }
        else if(resp.os=="ios")
        {
          this.new_version = resp.ios_version;
          if(this.version_check(this.version.__zone_symbol__value,resp.ios_version))
             // console.log(this.version.__zone_symbol__value)
            {
               if(resp.force_update){
                  this.forceUpdate(resp.ios_app_url);
                }else{
                  this.AppUPDAte(resp.ios_app_url);
                }

             // this.AppUPDAte(resp.ios_app_url);
            }
           else{
            this.showAlert(this.translate.instant('APP_UPTO_DATE'));
          }
        }
           // console.log(this.version.__zone_symbol__value)
         },(err)=>{
           loading.dismiss();
            this.errorService.errorsMethod(err) 
         })


       }
       else
    {
       this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
    }
  }
  
   // app updation
  async AppUPDAte(url) {
    const alert = await this.alertController.create({
      header:'Latest version available',
      message: 'Do you want to update this version '+this.new_version+' now?',
      // header:this.toasters[5].title,
      // message: this.toasters[6].title+' '+this.version.__zone_symbol__value,
      buttons: [
        {
          text:  this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.translate.instant('UPDATE_BUTTON'),
          handler: () => {
            
             this.urlOpen(url);
            
          }
        }
      ]
    });
    await alert.present();
    }

 // force update
  async forceUpdate(url) {

    const alert = await this.alertController.create({
      header:'Latest version available',
      message: 'Update this version '+this.new_version+' now?',
      keyboardClose:false,
      backdropDismiss:false,
      buttons: [
      {
          text: '',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.forceUpdate(url);
            this.platform.backButton.subscribe(() => {this.forceUpdate(url);});
          }
        },
         {
          text: this.translate.instant('UPDATE_BUTTON'),
          handler: () => {
            
            this.urlOpen(url);           
          }
        }
      ]
    });
  }


    urlOpen(url){
      if(url != "")
      {
        var url_temp = url.split(":");
        if(url_temp[0]=='http' || url_temp[0]=='https')
         {
           window.location.href = url;
           // const browser = this.iab.create(url,'_blank', 'location=yes');
         }
         else{
           this.market.open(url);
         }

      }
      else{
        this.toaster.warning_presentToast('Update link not available now...please try again later');
      }
    }
  
  
  
  //language changing settings

  languageChanged(ev: any)
  {
    this.lang=ev.detail.value;

    localStorage.setItem('LANG',this.lang);
    this.loader();
    this.user.translateLanguage();
    this.translate.use(this.lang);    
    this.ionViewWillEnter();
    this.ngOnInit();
  }
  async loader()
  {
    const loading = await this.loadingCtrl.create({
      // message:this.toasters[0].title,
      duration: 2000,
      spinner:null
    });
    await loading.present();
  }

  //open pages via Inapp browser

  help_desk(value)
  {
      if(value=='help')
      {
        if(isCordovaAvailable())
        {  
          const browser = this.iab.create(environment.help_desk_path,'_blank', 'location=yes');
        }
        else
        {
          this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
        }
      }
      else if(value=='jobs')
      {
        if(isCordovaAvailable())
        {
          const browser = this.iab.create(environment.web_path+'/jobs','_blank', 'location=yes');
        }
        else
        {
          this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
        }
      }
      else if(value=='about')
      {
        if(isCordovaAvailable())
        {
          const browser = this.iab.create(environment.web_path+'/aboutus','_blank', 'location=yes');
        }
        else
        {
          this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
        }  
      }
      else if(value=='legal')
      {
        this.navCtrl.navigateRoot('legality'); 
      }
      else if(value=='terms')
      {
        if(isCordovaAvailable())
        {
          const browser = this.iab.create(environment.web_path+'/terms-conditions','_blank', 'location=yes');
        }
        else
        {
          this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
        } 
      }else{
        this.navCtrl.navigateForward(value);
      }

     

}
  //inside tutorial


//logout alert

    async logoutConfirm() {
    const alert = await this.alertController.create({
      header: this.translate.instant('CONFIRM'),
      message: this.translate.instant('LOGOUT_MESSAGE'),
      buttons: [
        {
          text:  this.translate.instant('NO'),
          role: 'cancel',
          cssClass:'custom_alert_class',
          handler: (blah) => {
          }
        }, {
          text: this.translate.instant('YES'),
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    await alert.present();
  }

  // logout process

  logout() {
          
          this.user.logout().subscribe((resp:any) => {
            var lang= 'en'
            if(localStorage.getItem('LANG')!=null){
              lang=localStorage.getItem('LANG');
            }
            localStorage.clear();
            localStorage.setItem('tutorialComplete', JSON.stringify(true));
            localStorage.setItem('LANG', lang);
            localStorage.setItem('dark-theme',JSON.stringify( true));



            this.navCtrl.navigateRoot('');
          },(err)=>{
            this.errorService.errorsMethod(err)

          })

 }

 //google 2fa settings

  google2fa(value)
  {
  this.setdiv=false;
  this.val=value.detail.checked;
  this.enable_2fa=localStorage.getItem('enable_2fa');
  // console.log(this.enabled)
   // console.log(this.enabled == false  && this.enable_2fa == 'false')
   if(this.enabled == true  && this.enable_2fa == 'false')
   {
       this.g2fdiv=true;
       this.enable_2fa='false'
       this.user.google_2fa().subscribe((resp:any) => {
                 this.key=resp.secret_key;
                 // console.log(this.key);
               },(err)=>{
               this.errorService.errorsMethod(err)
               });

   }
   else if(this.enabled == false && this.enable_2fa == 'true')
   {
            this.enable_2fa='true'
            this.g2fdiv=true;

   }
   else
        {
          this.g2fdiv=false;
          this.setdiv=true;
        }
  
   }  

//generate new key

new_google2fa()
  {
  this.user.generate_newkey().subscribe((resp:any) => {
                 this.key=resp.secret_key;
                 this.user.presentsuccessAlert(this.translate.instant(resp.message));
               },(err)=>{
                this.errorService.errorsMethod(err)
               });
  }

// generate new qr code

   async new_qr_code_google2fa()
  {
    const loading = await this.loadingCtrl.create({
           spinner: null,
          message: '',
        }); 
         loading.present();
         this.user.send_qr_url().subscribe((resp:any)=>{
           this.key=resp.secret_key;
           this.user.presentfailAlert(this.translate.instant('GOOGLE_2FA_QRCODE'),'<ion-img src="'+resp.qr_link+'">');
        loading.dismiss();
      },err=>{
        this.errorService.errorsMethod(err);
      })

  }

 // alert for enable or dissable google 2fa

  async enable2fa(values:any)
  {
     var email=localStorage.getItem('email');
    // console.log(values);
    const loading = await this.loadingCtrl.create({
      message:'loading',
      spinner:null
    });
    if(this.google2fa_Form.valid){
          this.data ={email:email, isEnabled:this.val, key:values.key};
        this.user.enable2fa(this.data).subscribe((resp:any)=>{
          loading.dismiss();
          if(typeof(resp)=='object')
           {
             this.presentAlert(resp);
           }
          else{
          this.toaster.warning_presentToast(this.translate.instant(resp));
            }
          localStorage.setItem('enable_2fa',this.val);
          this.setdiv=true;
          this.g2fdiv=false;
         this.google2fa_Form.reset();
          },(err)=>{
            loading.dismiss();
            this.user.presentfailAlert(this.translate.instant(err.error),'<ion-img src="assets/imgs/warning.png">');
            this.setdiv=true;
            this.g2fdiv=false;
            this.enabled=false;
            this.google2fa_Form.reset();
            })
     }
    else{
      if(this.google2fa_Form.get('key').hasError('required'))
      {
        this.toaster.warning_presentToast(this.translate.instant('ALL_REQUIRED'));
      }
      else if(this.google2fa_Form.get('key').hasError('pattern')){
        this.toaster.warning_presentToast('Invalid key');
      }
    }
  }
  cancel()
  {
     this.setdiv=true;
     this.g2fdiv=false;
     this.google2fa_Form.reset();
     this.enabled=localStorage.getItem('enable_2fa');
  }
  //copy or email backup codes

  async presentAlert(msg) {
    let i: any;
    let codes:any = msg.backup_codes;
    // this.bck_codes=this.toasters[16].title;
    // for(i in codes)
    // {
    //    this.bck_codes=this.bck_codes+codes[i]+",";
    // }
    this.bck_codes=this.translate.instant('BACK_UP_CODES')+' '+this.bck_codes+' '+this.translate.instant('BACK_UP_CODES_MSG')
    // console.log(this.bck_codes);
    let alert = await this.alertController.create({
      header: this.translate.instant(msg.message),
      message: msg.backup_codes,
      buttons: [
      {
          text:  this.translate.instant('NO'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
      },
      {
        // text: this.toasters[17].title,
        text: this.translate.instant('COPY'),
        handler: data => {
          this.clipboard.copy(this.bck_codes);
          // this.user.presentsuccessAlert(this.toasters[3].title)
          this.clipboard.paste().then(
           (resolve: string) => {
            },
            (reject: string) => {
            }
          );
          this.user.sendmail().subscribe((resp:any) => {
          if(resp){
            this.user.presentsuccessAlert(this.translate.instant(resp)+" and "+this.translate.instant('COPIED'));
            }
        },(err)=>{
          this.errorService.errorsMethod(err)
    }); 
        }
      }
      ]

    });

    await alert.present();
  }

 //copy backup codes

  copy(val){
  let selBox = document.createElement('textarea');
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.user.presentsuccessAlert(this.translate.instant('COPIED'))
    }

   goUploads()
   {
     this.navCtrl.navigateRoot('upload-docs');
   }
   async showAlert(msg) {
    const alert = await this.alertController.create({
      header: this.translate.instant('NOTIFICATION'),
      message: msg,
      buttons:[this.translate.instant('OK_BUTTON')]
    });

    await alert.present();
  } 
     toggle()
  {
    this.navCtrl.navigateForward("notifications");
  }
  version_check(app_v,resp_v){
    var app_v_temp = app_v.split('.');
    var resp_v_temp = resp_v.split('.');
    if(parseInt(app_v_temp[0]) < parseInt(resp_v_temp[0])){
      return true;
    }else if(parseInt(app_v_temp[1]) < parseInt(resp_v_temp[1])){
      return true;
    }else if(parseInt(app_v_temp[2]) < parseInt(resp_v_temp[2])){
      return true;
    }else{
      return false;
    }
    

  }
  allow_ACTIVITY(){
    var postData = {user:{share_activities_to_followers:this.allow.share_activities_to_followers,allow_sms:this.allow.allow_sms}}
    this.user.enable_or_disable_settings(postData).subscribe((resp:any)=>{
        // console.log(resp);
        
      },err=>{
        this.errorService.errorsMethod(err);
    })
  }
}
