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
  selector: 'app-verifyotp',
  templateUrl: './verifyotp.page.html',
  styleUrls: ['./verifyotp.page.scss'],
})
export class VerifyotpPage implements OnInit {
	otp_code:any;
	alert_Data = {header:'',img:'',message:''};
	verification_id:any =localStorage.getItem('verificationId'); 
	  details:any = { email: '', otp: ''};
	  very:any=false;
	  old_numb:string;last:string;
	  otpForm: FormGroup;
	  otpForm_touched:boolean = false;
    need_to_update_phone:any;
     maxTime: any=120;
      timer:any;
       hidevalue:boolean=true;
    OTP:any;
    OTPmessage:any;
     seconds;
  minutes;
  hours;
  clockDisplay: string;
  interval: number;
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

  ionViewWillEnter() {
    this.old_numb = localStorage.getItem('phn_num');
    this.last = this.old_numb;
    this.need_to_update_phone=localStorage.getItem('need_to_update_phone');
    console.log(this.last);
     this.StartTimer();
  }
  ngOnInit()
  {
    this.otpForm = this.formBuilder.group({
   		otp: new FormControl('', Validators.compose([Validators.required,Validators.pattern('[0-9]{6}')]))
    })
  }
  	verifyotp() {
	    if(this.otpForm.invalid)
	     {
	       this.otpForm_touched = true;
	     }
	    else{
        localStorage.setItem('otp_code',this.otpForm.controls.otp.value);
        var email = localStorage.getItem('email');
        var signup  = localStorage.getItem('signup');
        this.details ={email:email,otp:this.otpForm.controls.otp.value}; 
          this.user.verify_otp(this.details).subscribe((resp:any) => {
            if(resp.code==4){
              
              return;
            }
            this.alert_Data.header='';
			this.alert_Data.img ='success';
			this.alert_Data.message=this.translate.instant(resp);
			this.alert_.presentAlert(this.alert_Data);
             this.navCtrl.navigateRoot('login');
             localStorage.removeItem('mobile_status');
          },(err) => {
            this.errorService.errorsMethod(err)
          });
       
     	} 
 	}
 	change_num(){
    this.presentAlertPrompt();
  }
    //update phone

  async presentAlertPrompt() {
    const alert = await this.alertCtrl.create({
      header:this.translate.instant('CHANGE_NUMBER'),
      inputs: [
        {
          name: 'number',
          type: 'number',
          id:  'numb',
          placeholder: this.translate.instant('ENTER_PHONE')
        }
      ],
      buttons: [
        {
          text: this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: this.translate.instant('OK_BUTTON'),
          handler: data => {
            var phn= new RegExp(/^(([6|7|8|9])[0-9]{9})+$/);
        if(data.number == '' ) {
          this.toaster.warning_presentToast(this.translate.instant('PHONE_REQUIRED'));
        }else if(!phn.test(data.number))
          {
            this.toaster.warning_presentToast(this.translate.instant('PHONE_PATTERN'));
          } 
        else {
        var email = localStorage.getItem('email');
        this.user.changeNumber(email, data.number).subscribe((resp:any) =>{
          // code4:For error messages and no data messages
          if(resp.code==4)
          {
            this.toaster.error_presentToast(this.translate.instant(resp.message))
          }
          else
          {
            localStorage.setItem('phn_num', data.number);
            this.alert_Data.header='';
			this.alert_Data.img ='success';
			this.alert_Data.message=this.translate.instant(resp);
			this.alert_.presentAlert(this.alert_Data);
            this.old_numb = localStorage.getItem('phn_num');
            this.last = '******'+this.old_numb.slice(-4);
          }
        }, err =>{
          this.errorService.errorsMethod(err)
        });

      }
          
          }
        }
      ]
    });

    await alert.present();
  }


 	//side menu disable before login

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }
  resendOtp()
  {
    var email = localStorage.getItem('email');
    this.user.resend_otp(email).subscribe((resp:any) => {
    	this.alert_Data.header='';
		this.alert_Data.img ='success';
		this.alert_Data.message=this.translate.instant(resp);
		this.alert_.presentAlert(this.alert_Data);
            this.hidevalue=false;
            this.maxTime=120;
            this.StartTimer();
          },(err) => {
             this.errorService.errorsMethod(err)
            });
  }


  StartTimer(){
    this.timer = setTimeout(x => 
      {
          if(this.maxTime <= 0) { }
          this.maxTime -= 1;

          if(this.maxTime>0){
            this.hidevalue = false;
            if (this.maxTime % 60 < 10) {
              this.seconds = '0' + parseInt("" + this.maxTime % 60);
            } else {
              this.seconds = '' + parseInt((this.maxTime % 60).toString());
            }
            if (this.maxTime / 60 < 10) {
              this.minutes = '0' + parseInt("" + this.maxTime / 60, 10);
            } else {
              this.minutes = '' + parseInt((this.maxTime / 60).toString(), 10);
            }
            if (this.minutes >= 60) {
               this.minutes = parseInt("" + this.minutes % 60);
             }
            this.clockDisplay = this.minutes + "m:" + this.seconds + "s";
                  this.StartTimer();
                }
          
          else{
              this.hidevalue = true;
          }

      }, 1000);
  }


  valid_fun(filed){
    if(!this.otpForm.touched && !this.otpForm_touched){
      return '';
    }
    if(filed == 'otp'){
      if(this.otpForm.get('otp').hasError('required'))
      {
        return this.translate.instant('OTP_REQUIRED');
      }
      else if(this.otpForm.get('otp').hasError('pattern'))
      {
        return this.translate.instant('OTP_PATTERN');
      }
        return '';
    }
  }

}
