import { Component, OnInit ,ViewChild} from '@angular/core';
import { NavController,AlertController,MenuController,LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormControl,Validators} from '@angular/forms';
import { isCordovaAvailable } from '../../providers/is-cordova-available'

// import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { ToastersService, 
  UserService, 
  LoadingService,
  ErrorService, 
  AlertsService} from '../../providers'
declare var SMSReceive: any;

@Component({
  selector: 'app-login-otp',
  templateUrl: './login-otp.page.html',
  styleUrls: ['./login-otp.page.scss'],
})
export class LoginOtpPage{
  alert_Data = {header:'',img:'',message:''};
  // @ViewChild('cd') private countdown: CountdownComponent;

      // config: CountdownConfig = { leftTime:10};

  otp_code:any;
   email_err:any='';
   resend:boolean=false;
  account: { email: string, password: string, playerId:string,source:string ,login_type:any,verification_code:any} = {
    email: '',
    password: '',
    playerId: localStorage.getItem('playerID'),
    source:'Mobile App',
    login_type:'otp',
    verification_code:''
  };
  phone_number:any;
   timer:any;
  // maxTime:number=120;
  hidevalue:boolean=true;
  OTP:any;
  OTPmessage:any;
  // minutes:number;

  seconds;
  minutes;
  hours;
  clockDisplay: string;
  interval: number;

  maxTime: any=120;

  
  otpForm: FormGroup;
  otpForm_touched:boolean = false;
  constructor(public navCtrl: NavController, 
    public user: UserService,private alert_: AlertsService,private errorService: ErrorService,private toaster:ToastersService,
    private formBuilder: FormBuilder,public menu: MenuController,public alertController:AlertController,public translate: TranslateService,public loadingCtrl: LoadingController) {
        
    }

  ngOnInit() {
    this.otpForm = this.formBuilder.group({
           otp: new FormControl('', Validators.compose([Validators.required,Validators.pattern('[0-9]{6}')]))
            });
  }
    
    // otp auto read 
    ionViewDidEnter() {
       this.phone_number=localStorage.getItem('phn_num');
       this.menu.enable(false);
        this.maxTime=120;
       this.StartTimer();
       if(isCordovaAvailable())
      {
        SMSReceive.startWatch(
          () => {
            document.addEventListener('onSMSArrive', (e: any) => {
              var IncomingSMS = e.data;
              console.log(IncomingSMS);
              this.processSMS(IncomingSMS);
            });
          },
          () => { console.log('watch start failed') }
        )
      }

    }

    stop() {
      SMSReceive.stopWatch(
        () => { console.log('watch stopped') },
        () => { console.log('watch stop failed') }
      )
    }
    
    // getting the correct otp from the message
    processSMS(data) {
      // Check SMS for a specific string sequence to identify it is you SMS
      // Design your SMS in a way so you can identify the OTP quickly i.e. first 6 letters
      // In this case, I am keeping the first 6 letters as OTP
      const message = data.body;
      console.log(message.indexOf('enappd_starters'));
      // if (message && message.indexOf('enappd_starters') != -1) {
        var temp_txt = message.match(/(\d{6})/);
        var temp_otp = temp_txt[0].split(",");
        this.OTP = temp_otp[0];
        console.log(this.OTP);
        this.OTPmessage = 'OTP received. Proceed to login'
        this.stop();
      // }
    }

    // menu disable
    ionViewWillLeave() {
    
      this.menu.enable(true);
      this.maxTime=0;
    }

    // submiting the otp along with that verification 
  async verifyotp(){
    this.email_err ='';
    const loading = await this.loadingCtrl.create({
       spinner: null,
      message: '',
    }); 
     if(this.otpForm.invalid)
       {
         this.otpForm_touched = true;
       }
      else{
          localStorage.setItem('otp_code',this.otpForm.controls.otp.value);
          var user_name = localStorage.getItem('email');
          var signup  = localStorage.getItem('signup');
          this.account.email= user_name;
          this.account.verification_code=this.otpForm.controls.otp.value;
          loading.present();
            this.user.login(this.account).subscribe((resp:any) => {
               loading.dismiss();
               // console.log(resp.session);
               if(resp.code==14){
                this.alert_Data.header='';
                this.alert_Data.img ='server_not_found';
                this.alert_Data.message=this.translate.instant(resp.message);
                this.alert_.presentAlert(this.alert_Data);
               }
                if(resp.code==4){
                  this.alert_Data.header='';
                  this.alert_Data.img ='warning';
                  this.alert_Data.message=this.translate.instant(resp.message);
                  this.alert_.presentAlert(this.alert_Data);
                 
                }

                 if(resp.code == 7)
               {
                     
                     localStorage.setItem('email', resp.email);
                     resp.message='Verify OTP';
                    this.toaster.warning_presentToast(this.translate.instant(resp.message));
                    localStorage.setItem('phn_num', resp.phone);
                    this.navCtrl.navigateRoot('verifyotp');
              }


               if(resp.jwt){
              
              localStorage.setItem('token', JSON.stringify(resp.jwt));
              localStorage.setItem('email', resp.email);
              localStorage.setItem('phn_num', resp.phone);
              localStorage.setItem('enable_2fa','false');
              localStorage.setItem('email',resp.email);
              localStorage.setItem('mobile_status','true');
             
                this.navCtrl.navigateRoot('enterpin');
              
             }
             
        
               }, (err) => {
                 loading.dismiss();
                 if(err.error=="UNCONFIRMED_MESSAGE"){
                   this.email_err = this.translate.instant(err.error)
                   // this.user.presentToast(this.translate.instant(err.error));
                  
                 }
                 else if(err.error=="INVALID_USER")
                 {
                   this.email_err = this.translate.instant(err.error)
                   // this.user.presentToast(this.translate.instant(err.error));
                 }
                 else
                {
                  this.errorService.errorsMethod(err)
                }
                
                
              });
         
       } 
  }
  
  // validation
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

// resending the otp and the timer will gain set to 2 mins
  resendOtp()
  {

    var email = localStorage.getItem('email');
    var login_with_otp=true;
    this.user.login_resend_otp(email).subscribe((resp:any) => {
            this.user.presentsuccessAlert(this.translate.instant(resp));
            this.hidevalue=false;
            this.maxTime=120;
            this.StartTimer();
          },(err) => {
             this.errorService.errorsMethod(err)
            });
  }

  // the otp expire timer calculations

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

  
  
  


}
