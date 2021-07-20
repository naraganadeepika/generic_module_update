import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormBuilder,FormControl,Validators,FormGroup } from '@angular/forms';
import { NavController, AlertController,MenuController, LoadingController } from '@ionic/angular';
import { ToastersService, 
  UserService, 
  LoadingService,
  ErrorService, 
  AlertsService} from './providers';


import {ThemeService  } from './providers/theme/theme.service';

import { isCordovaAvailable } from './providers/is-cordova-available'
import { environment } from '../environments/environment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TranslateService } from '@ngx-translate/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Market } from '@ionic-native/market/ngx';
import { AuthGuardService } from './providers';
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  version:any;
      new_version:any;
      kyc_status:any;

  constructor(
    private translate: TranslateService,
    private platform: Platform,
    public auth:AuthGuardService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public user:UserService,
    private iab: InAppBrowser,
    private errorService: ErrorService,
    public formBuilder: FormBuilder,
    private loading_:LoadingService,
    public menu: MenuController,
    private toaster:ToastersService,
    private alert_: AlertsService,
    private navCtrl:NavController,
    private alertCtrl:AlertController,
    private appVersion: AppVersion,
    private loadingCtrl:LoadingController,
    private oneSignal: OneSignal,
    public market:Market,
    private themeService:ThemeService


  ) {
    this.initializeApp();
    this.translateLanguage();
    this.darktheme();
  }
  darktheme()
  {
    localStorage.setItem('dark-theme',JSON.stringify(false));
           var value =JSON.parse(localStorage.getItem('dark-theme'));
  
      if (value == true) {
        console.log(value);
        this.themeService.themeMode();
      }
  }

    initializeApp() {

    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.version =  this.appVersion.getVersionNumber();
          this.statusBar.overlaysWebView(false);
          this.statusBar.backgroundColorByHexString('#ED3833');
          this.statusBar.styleLightContent();
          this.statusBar.styleBlackTranslucent();
          this.statusBar.show();

      }
      this.splashScreen.hide();
      this.appcheck();
      
      this.pushNotifications();
  });
  }
  translateLanguage()
  {
    this.translate.setDefaultLang('en');
    var lang=localStorage.getItem('LANG');
    if(lang!=null){
     this.translate.use(lang);
    }
  else
      {
      lang='en';
      localStorage.setItem('LANG','en');
      } 
  }
   async appcheck()
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
          // console.log(resp);
          loading.dismiss();
        if(resp.os=="android")
        {
          this.new_version = resp.android_version;

          if(this.version_check(this.version.__zone_symbol__value,resp.android_version))
            {
                if(resp.force_update){
                  this.forceUpdate(resp.android_app_url);
                }else{
                  this.AppUPDAte(resp.android_app_url);
                }


                 
               
             
              }
        }
        else if(resp.os=="ios")
        {
          this.new_version = resp.ios_version;
          if(this.version_check(this.version.__zone_symbol__value,resp.ios_version))
            {
             if(resp.force_update){
                  this.forceUpdate(resp.android_app_url);
                }else{
                  this.AppUPDAte(resp.android_app_url);
                }
            }
        }
         },(err)=>{
           loading.dismiss();
           if(err.status==0 && err.statusText == "Unknown Error"){
             this.navCtrl.navigateRoot('/network-error')
             
            // this.presentAlert('You are offline, please try again!')
            return;
           }           
           // this.errorService.errorsMethod(err)
         })
       }
  }

    async forceUpdate(url) {

    const alert = await this.alertCtrl.create({
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
    await alert.present();
    }

      async AppUPDAte(url) {
    const alert = await this.alertCtrl.create({
      header:'Latest version available',
      message: 'Do you want to update this version '+this.new_version+' now?',
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

    urlOpen(url){
      if(url != "")
      {
        var app =  url.split(".")
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

  pushNotifications()
  {
    if (isCordovaAvailable()){
      
        this.oneSignal.startInit(environment.oneSignalAppId, environment.sender_id);
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        this.oneSignal.handleNotificationReceived().subscribe(data => {
              });
        this.oneSignal.getIds().then((id)=>{
         localStorage.setItem('playerID',id.userId);
          })
        this.oneSignal.handleNotificationOpened().subscribe(data => {
              this.navCtrl.navigateRoot(data.notification.payload.additionalData.url);
              });
        this.oneSignal.endInit();
     }
  }
  logout() {
          this.user.logout().subscribe((resp:any) => {
            var lang= 'en'
            if(localStorage.getItem('LANG')!=null){
              lang=localStorage.getItem('LANG');
            }
            localStorage.clear();
            localStorage.setItem('tutorialComplete', JSON.stringify(true));
            localStorage.setItem('LANG', lang);
           this.navCtrl.navigateRoot('welcome');
          },(err)=>{
            this.errorService.errorsMethod(err)
          })

 } 

 async logoutConfirm() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('CONFIRM'),
      message: this.translate.instant('LOGOUT_MESSAGE'),
      buttons: [
        {
          text:  this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.translate.instant('OK_BUTTON'),
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    await alert.present();
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

 get_summary()
  {
      if(this.auth.isAuthenticated()){
        this.user.over_all_kyc_status().subscribe((resp:any)=>{
         this.kyc_status=resp.kyc;
        },err=>{
          // this.errorService.errorsMethod(err);
        })
      }
      this.user.get_user_summary().subscribe((resp:any) => {
        // console.log(resp)
        this.user.user_suspend = false;
        if(resp.code == 10){
          this.user.user_suspend = true;
        }
        
        this.user.username=resp.user_name;
        this.user.user_pic=resp.profile_pic;
        this.user.referral_code=resp.referral_code;
        this.user.user_level=resp.level;
        this.user.followees_count=resp.followees_count;
        this.user.followers_count=resp.followers_count;
    },(err)=>{
      this.errorService.errorsMethod(err)
    })
   }
}
