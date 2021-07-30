import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl,Validators,FormGroup } from '@angular/forms';
import { NavController, AlertController,MenuController } from '@ionic/angular';
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
  selector: 'app-forgotpwd',
  templateUrl: './forgotpwd.page.html',
  styleUrls: ['./forgotpwd.page.scss'],
})
export class ForgotpwdPage implements OnInit {
	public forget_Form:FormGroup;
	alert_Data = {header:'',img:'',message:''};
	public forget_For_touched:boolean = false;
	account: { username: any,} = {
	username: ''
	};
	resend_button:any=false;
	constructor(
		public user:UserService,
		private iab: InAppBrowser,
		private errorService: ErrorService,
		public translate: TranslateService,
		public formBuilder: FormBuilder,
		private loading_:LoadingService,
		public menu: MenuController,
		private toaster:ToastersService,
		private alertCtrl:AlertController,
		private alert_: AlertsService,
		private navCtrl:NavController
		) { }

  ngOnInit() {
    this.forget_Form = this.formBuilder.group({
       username: new FormControl  ('',Validators.compose([Validators.required,Validators.pattern(/^(([6|7|8|9])[0-9]{9}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])),
    });
  }

   //submit form method
  async resetpassword() {
      	this.forget_For_touched = true;
     
        var user = this.account.username; //change form to id or containment selector
        var em = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        var phn= new RegExp(/^(([6|7|8|9])[0-9]{9})$/);
        if(this.forget_Form.get('username').hasError('required')){
          this.forget_Form.get('username').setErrors({serverValidationError: true});
        }
        else if( !em.test(user) && !phn.test(user))
        {
          this.forget_Form.get('username').setErrors({serverValidationError: true});
            // return false;
        }
     else{
        if(phn.test(user))
        {
          localStorage.setItem('phone_number',user);
        }
        else if(em.test(user))
        {
         localStorage.setItem('email',user); 
        }
        this.loading_.presentLoading();
        this.user.forgetpassword(this.account).subscribe((resp:any) => {
          this.loading_.dismissLoading();
	        this.alert_Data.header='';
			this.alert_Data.img ='success';
			this.alert_Data.message=this.translate.instant(resp);
			this.alert_.presentAlert(this.alert_Data);
          if(resp=="OTP_SENT" || resp=='OTP sent to your mobile')
          {
            this.navCtrl.navigateRoot('resetpwd');
          }
          else{
            this.navCtrl.navigateRoot('login');
          }
          
        }, (err) => { 
          this.loading_.dismissLoading();
      
        if(err.error=="Unconfirmed user")
        {
        	this.alert_Data.header='';
			this.alert_Data.img ='warning';
			this.alert_Data.message=this.translate.instant(err.error);
			this.alert_.presentAlert(this.alert_Data);
          	this.resend_button=true;
        }
        else
        {
          this.errorService.errorsMethod(err);
        }
               
        });
      }
  	}



  	//resend email confirmation for email verification

  async resend() {
  let alert = await this.alertCtrl.create({
    header: this.translate.instant('RESEND_CONFIRMATION'),
    backdropDismiss:false,
    inputs: [
      {
        name: 'email_confirm',
        placeholder: this.translate.instant('ENTER_MAIL'),
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
        text: 'Yes',
        handler: data => {
             var em = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
             if(data.email_confirm == "")
             {
               this.toaster.warning_presentToast(this.translate.instant('EMAIL_REQUIRED'));
               this.resend_button=false;
             }
             else if( !em.test(data.email_confirm))
              {
                this.toaster.warning_presentToast(this.translate.instant('EMAIL_PATTERN'));
              }
             else{
               this.user.sendConfirm(data.email_confirm).subscribe((resp:any) => {
               	this.alert_Data.header='';
				this.alert_Data.img ='success';
				this.alert_Data.message=this.translate.instant(resp);
				this.alert_.presentAlert(this.alert_Data);
                this.resend_button=false;
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

  //side menu disable code before login
  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  // validations
  valid_fun(filed){
    var em = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    var phn= new RegExp(/^(([6|7|8|9])[0-9]{9})$/);
    if(!this.forget_Form.touched && !this.forget_For_touched){
      return '';
    }
    if(filed == 'username'){
      if(this.forget_Form.get('username').hasError('required')){
        // this.forget_Form.get('username').setErrors({serverValidationError: true});
        return this.translate.instant('EMAIL_PHONE_REQUIRED')
      }else if(!em.test(this.forget_Form.get('username').value) && !phn.test(this.forget_Form.get('username').value)){
        // this.forget_Form.get('username').setErrors({serverValidationError: true});
        return this.translate.instant('INVALID_EMAIL_PHONE')
      }
      return ''
    }
  }

}
