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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	public login_Form : FormGroup;
	account: { email: string, password: string, player_id:string,source:string } = {
	    email: '',
	    password: '',
	    player_id: localStorage.getItem('playerID'),
	    source:'app'
	};
	username_err:any='';
	pwd_err:any='';
	private loginErrorString: string;
	private returnUrl:any;
	resend_button:any=false;
	passwordType: string = 'password';
  	passwordIcon: string = 'eye-outline';
  	alert_Data = {header:'',img:'',message:''};
	constructor(
		public user:UserService,
		private iab: InAppBrowser,
		private errorService: ErrorService,
		public translate: TranslateService,
		public formBuilder: FormBuilder,
		private loading_:LoadingService,
		public menu: MenuController,
		private toaster:ToastersService,
		private alert_: AlertsService,
		private navCtrl:NavController,
		private alertCtrl:AlertController
		) { }

  	ngOnInit(){
      this.login_Form = new FormGroup({
      username: new FormControl  ('',Validators.compose([Validators.required])),
        pwd: new FormControl('', Validators.compose([Validators.required,Validators.minLength(8)])),
      });

    }
    hideShowPassword() {//hide or show functionality
	    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
	    this.passwordIcon = this.passwordIcon === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
	}


	//side menu disable option before login
	ionViewDidEnter() {
		this.menu.enable(false);
	}

	ionViewWillLeave() {
		this.menu.enable(true);
	}




	change()
	  {
	    this.username_err ='';
	   this.account.email = this.login_Form.get('username').value;	  
	   var user = this.account.email; //change form to id or containment selector
	   var em = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	   var phn= new RegExp(/^(([6|7|8|9])[0-9]{9})+$/);
	   var u_id = new RegExp(/^(([A-Z|a-z])[A-Za-z0-9]{6,})+$/);
	   	if(em.test(user)){
          this.account.email=this.account.email.toLowerCase();
        }

	      if(this.login_Form.get('username').hasError('required')){
	         this.username_err = this.translate.instant('USERNAME_REQUIRED');
	          }
	        else if( !em.test(user) && !phn.test(user) && !u_id.test(user)){  
	          this.login_Form.get('username').setErrors({serverValidationError: true});
	        if(!u_id.test(user)){
	          this.username_err = this.translate.instant('USERNAME_PATTERN');
	        }
	        else if(!em.test(user))
	        {
	          this.username_err = this.translate.instant('EMAIL_PATTERN');
	        }else if(!phn.test(user)){
	          this.username_err = this.translate.instant('PHONE_PATTERN');
	        }
	      }
	  }
	   pwd_change(){
	           this.pwd_err = '';
	           this.account.password = this.login_Form.get('pwd').value;
	           if(this.login_Form.get('pwd').hasError('required')){
	             this.pwd_err = this.translate.instant('PASSWORD_REQUIRED')
	          }
	          else if(this.login_Form.get('pwd').hasError('minlength')){
	            this.pwd_err = this.translate.instant('PASSWORD_MINLENGTH')
	          }
	   }


	async doLogin() {
	    this.username_err ='';
	    this.pwd_err = '';
	    this.account.password = this.login_Form.get('pwd').value;
	    if(this.login_Form.invalid){
	    	if(this.login_Form.get('username').hasError('required')){
	         this.username_err = this.translate.instant('USERNAME_REQUIRED');
	        }
           if(this.login_Form.get('pwd').hasError('required')){
             this.pwd_err = this.translate.instant('PASSWORD_REQUIRED')
          }
        }else{
        	this.account.player_id = localStorage.getItem('playerID');
	        this.loading_.presentLoading();
	        this.user.login(this.account).subscribe((resp:any) => {
	        	this.loading_.dismissLoading();
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
		          localStorage.setItem('enable_2fa',resp.enable_2fa);
		          localStorage.setItem('username',resp.email);
		          localStorage.setItem('mobile_status','true');

		          if(resp.mobile_status == false){
		           if(resp.code == 7)
		              {
		              	this.toaster.warning_presentToast(this.translate.instant(resp.message));
		              	localStorage.setItem('phn_num', resp.phone);
		              }
		           else{
		           		this.alert_Data.header='';
		        		this.alert_Data.img ='success';
		        		this.alert_Data.message=this.translate.instant(resp.message);
		        		this.alert_.presentAlert(this.alert_Data);
		              }
		            this.navCtrl.navigateRoot('verifyotp');
		          }
		          else{
		            this.navCtrl.navigateRoot('enterpin');
		          }
		         // else {
		         //  this.navCtrl.navigateRoot(this.returnUrl);
		         //  }
		         }
	        },err=>{
	        	this.loading_.dismissLoading();
	        	if(err.error=="UNCONFIRMED_MESSAGE"){
		         this.username_err = this.translate.instant(err.error)
		         }
		         else if(err.error=="INVALID_USER")
		         {
		           this.username_err = this.translate.instant(err.error)
		         }
		         else
		        {
		          this.errorService.errorsMethod(err)
		        }
	        })
	        
        }
	} 
  email_err_msg:any='';
  async presentPrompt() {
    // var email_err_msg='';
  let alert = await this.alertCtrl.create({
    backdropDismiss:false,
    header: this.translate.instant('RESEND_CONFIRMATION'),
    // message: this.email_err_msg,
    inputs: [
      {
        name: 'email_confirm',
        type: 'email',
        placeholder: this.translate.instant('ENTER_EMAIL'),
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
        text: this.translate.instant('SEND_BUTTON'),
        handler: data => {
        var em = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
             if(data.email_confirm == "")
             {
               
               this.toaster.warning_presentToast(this.translate.instant('EMAIL_REQUIRED'));
               return false;
             }
             else if( !em.test(data.email_confirm))
              {
                this.toaster.warning_presentToast(this.translate.instant('EMAIL_PATTERN'));
                return false;
              }
             else{
               this.user.sendConfirm(data.email_confirm).subscribe((resp:any) => {
               		this.alert_Data.header='';
	        		this.alert_Data.img ='success';
	        		this.alert_Data.message=this.translate.instant('EMAIL_CONFIRM_SUCCESS');
	        		this.alert_.presentAlert(this.alert_Data);
                 this.resend_button==true;
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
resend_confirmation(){
  this.presentPrompt();
}


	//open terms via inapp browser
	  terms(){
	  	
	      if(isCordovaAvailable())
	        {
	          const browser = this.iab.create(environment.web_path+'/terms-conditions','_blank', 'location=yes');
	        }
	        else
	        {
	          this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
	        } 
	  }
	//open privacy via inapp browser
	  privacy(){
	      if(isCordovaAvailable())
	        {
	          const browser = this.iab.create(environment.web_path+'/privacy-policy','_blank', 'location=yes');
	        }
	        else
	        {
	          this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
	        } 
	  }	

}
