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
  selector: 'app-resetpwd',
  templateUrl: './resetpwd.page.html',
  styleUrls: ['./resetpwd.page.scss'],
})
export class ResetpwdPage implements OnInit {
	pwdupdate_Form:FormGroup;
	pwdupdate_Form_touched:boolean=false;
	passwordType: string = 'password';
  	passwordIcon: string = 'eye-outline';
  	info_icon:any =false;
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
		private navCtrl:NavController
		) { }

  	hideShowPassword() {//hide or show functionality
	    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
	    this.passwordIcon = this.passwordIcon === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
	}
	ngOnInit() {
    this.pwdupdate_Form = this.formBuilder.group({
        newpassword: new FormControl('', Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15),Validators.pattern('^.*(?=..*[0-9])(?=.*[a-z]{0,12})(?=.*[A-Z])(?=.*[@#$%*&]).*$')])),
        confirmpassword: new FormControl('', Validators.compose([Validators.required,Validators.minLength(8)])),
        verification_code:new FormControl('',Validators.compose([Validators.required,Validators.minLength(6),Validators.pattern('^([1-9]{1}[0-9]{5})+$')]))  
        
    },{validator:this.checkPwd('newpassword','confirmpassword')});
  	}
  	checkPwd(newpassword,confirmpassword){
    return (group: FormGroup) => {
            let passwordInput = group.controls[newpassword],
                passwordConfirmationInput = group.controls[confirmpassword];
            if (passwordInput.value !== passwordConfirmationInput.value) {
                return passwordConfirmationInput.setErrors({notEquivalent: true})
            }
            else {
                return passwordConfirmationInput.setErrors(null);
            }
          }
  	}

  	 //reset password form submission

  	async resetpassword(values) 
  	{	
    
    if(this.pwdupdate_Form.invalid)
      {
        this.pwdupdate_Form_touched = true;
      }
      else 
      {
         var account={
          password:values.newpassword,
          password_confirmation:values.confirmpassword,
          verification_code:values.verification_code,
          phone_number:localStorage.getItem('phone_number')
          }
          this.loading_.presentLoading();
        this.user.resetpassword(account).subscribe((resp:any) => {
          this.loading_.dismissLoading();
        this.alert_Data.header='';
		this.alert_Data.img ='success';
		this.alert_Data.message=this.translate.instant(resp);
		this.alert_.presentAlert(this.alert_Data);
        localStorage.removeItem('phone_number')
        this.navCtrl.navigateRoot('login');  
      
      },(err)=>{
        this.loading_.dismissLoading();
       this.errorService.errorsMethod(err)
     });
     }
     
    }
    resendotp()
	   {
	   var account={username:localStorage.getItem('phone_number')}
	   this.user.forgetpassword(account).subscribe((resp:any) => {
	   	this.alert_Data.header='';
		this.alert_Data.img ='success';
		this.alert_Data.message=this.translate.instant(resp);
		this.alert_.presentAlert(this.alert_Data);
	   this.navCtrl.navigateRoot('resetpwd');

	   }, err=> {
	   this.errorService.errorsMethod(err)
	   })
	   }
    valid_fun(filed){
    if(!this.pwdupdate_Form.touched){
      return '';
    }
    
    if(filed == 'newpassword'){
      if(this.pwdupdate_Form.get('newpassword').hasError('required'))
      {
        return this.translate.instant('NEW_PASSWORD_REQUIRED')
      }
      else if(this.pwdupdate_Form.get('newpassword').hasError('minlength'))
      {
         return this.translate.instant('NEW_PASSWORD_LENGTH')
      }
      else if(this.pwdupdate_Form.get('newpassword').hasError('maxlength'))
      {
        return this.translate.instant('PASSWORD_MAXLENGTH')
      }
      else if(this.pwdupdate_Form.get('newpassword').hasError('pattern'))
      {
        this.info_icon=true;
        return this.translate.instant('PASSWORD_PATTERN')
        
      }
        return '';
    }
    if(filed == 'confirmpassword'){
      if(this.pwdupdate_Form.get('confirmpassword').hasError('required'))
      {
        return this.translate.instant('CONFIRM_PASSWORD_REQUIRED')
      }
      else if(this.pwdupdate_Form.get('confirmpassword').hasError('minlength'))
      {
         return this.translate.instant('CONFIRM_PASSWORD_MINLENGTH')
      }
      else if((this.pwdupdate_Form.get('newpassword').value)!=(this.pwdupdate_Form.get('confirmpassword').value))
      {
        return this.translate.instant('PASSWORD_MISMATCH');
      }
        return '';
    }

    if(filed == 'verification_code'){
      if(this.pwdupdate_Form.get('verification_code').hasError('required'))
      {
        return this.translate.instant('ENTER_OTP')
      }
        return '';
    }
  }

}