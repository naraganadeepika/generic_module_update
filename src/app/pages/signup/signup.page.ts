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
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  email:any;
  account:any = { fname: '', lname: '', phn: '', eid: '', pwd: '', source:'Mobile App' };
  alert_Data = {header:'',img:'',message:''};
	public signup_Form: FormGroup;
  signup_Form_touched:boolean=false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-outline';
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

  ngOnInit() {
  	this.signup_Form = this.formBuilder.group({
        fname: new FormControl('', Validators.compose([Validators.required,Validators.minLength(3),Validators.pattern('[a-zA-Z ]*')])),
        lname: new FormControl('', Validators.compose([Validators.required,Validators.minLength(3),Validators.pattern('[a-zA-Z ]*')])),
        phn_num: new FormControl('', Validators.compose([Validators.required,Validators.minLength(10),Validators.pattern('^(([6|7|8|9])[0-9]{9})+$')])),
        email: new FormControl('', Validators.compose([Validators.required,Validators.minLength(0),Validators.pattern("[a-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})")])),
        pwd: new FormControl('', Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15),Validators.pattern('^.*(?=..*[0-9])(?=.*[a-z]{0,12})(?=.*[A-Z])(?=.*[@#$%*&]).*$')])),
        c_pwd: new FormControl('', Validators.compose([Validators.required,Validators.minLength(8)])),
        referral_code: new FormControl('',Validators.compose([Validators.minLength(3)])),
    },{validator:this.checkPwd('pwd','c_pwd')});
  }
     //comparision of passwords
	checkPwd(pwd,c_pwd){
	    return (group: FormGroup) => {
            let passwordInput = group.controls[pwd],
                passwordConfirmationInput = group.controls[c_pwd];
            if (passwordInput.value !== passwordConfirmationInput.value) {
                return passwordConfirmationInput.setErrors({notEquivalent: true})
            }
            else {
                return passwordConfirmationInput.setErrors(null);
            }
	    }
	}
  hideShowPassword() {//hide or show functionality
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }
  signupSubmit(values:any){
    this.signup_Form_touched = true;
    if(values.referral_code !="")
    {
      this.signup_Form.get('referral_code').setErrors({serverValidationError: true});
    }else{
      this.signup_Form.get('referral_code').setErrors({serverValidationError: false});
      this.signup_Form.get('referral_code').updateValueAndValidity();
    }
    if(this.signup_Form.valid){
      this.account ={firstName:values.fname, lastName: values.lname,phone: values.phn_num,email:values.email,password:values.pwd,confirm_password:values.c_pwd,referral_code:values.referral_code, playerId: localStorage.getItem('playerID'),registered_from : "app"};
      this.account.email=values.email.replace(/\s+/g, "").toLowerCase();
      this.loading_.presentLoading();
      this.user.signup(this.account).subscribe((resp:any) => {
        this.loading_.dismissLoading();
        console.log(resp);
        if(typeof(resp)== 'object'){
          this.toaster.error_presentToast(this.translate.instant(resp.message))
        }else{
          this.alert_Data.header='';
          this.alert_Data.img ='success';
          this.alert_Data.message=this.translate.instant(resp);
          this.alert_.presentAlert(this.alert_Data);
          var email =this.signup_Form.get('email').value;
          var phn_num =this.signup_Form.get('phn_num').value;
          localStorage.setItem('email',email);
          localStorage.setItem('phn_num',phn_num);
          localStorage.setItem('signup',JSON.stringify(true));
          this.navCtrl.navigateRoot('/verifyotp');
        }
      },err=>{
        this.loading_.dismissLoading();
        this.errorService.errorsMethod(err)
      })
    }
    
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

  valid_fun(filed){
    if(!this.signup_Form.touched && !this.signup_Form_touched){
      return '';
    }
    if(filed == 'fname'){
      if(this.signup_Form.get('fname').hasError('required'))
      {
        return this.translate.instant('FIRST_NAME_REQUIRED');
      }
      else if(this.signup_Form.get('fname').hasError('minlength'))
      {
        return this.translate.instant('FIRST_NAME_MINLENGTH');
      }
      else if(this.signup_Form.get('fname').hasError('pattern'))
      {
        return this.translate.instant('FIRST_NAME_PATTERN');
      }
        return '';
    }else if(filed == 'lname'){
        if(this.signup_Form.get('lname').hasError('required'))
        {
          return this.translate.instant('LAST_NAME_REQUIRED');
        }
        else if(this.signup_Form.get('lname').hasError('minlength'))
        {
          return this.translate.instant('LAST_NAME_MINLENGTH')
        }
        else if(this.signup_Form.get('lname').hasError('pattern'))
        {
          return this.translate.instant('LAST_NAME_PATTERN');
        }
        return '';
    }
    else if(filed == 'email'){
        if(this.signup_Form.get('email').hasError('required'))
        {
          return this.translate.instant('EMAIL_REQUIRED');
        }
        else if(this.signup_Form.get('email').hasError('pattern'))
        {
          return this.translate.instant('EMAIL_PATTERN');
        }
        return '';
    }
    else if(filed == 'phn_num'){
        if(this.signup_Form.get('phn_num').hasError('required'))
        {
          return this.translate.instant('PHONE_REQUIRED');
        }
        else if(this.signup_Form.get('phn_num').hasError('minlength'))
        {
          return this.translate.instant('PHONE_MINLENGTH')
        }
        else if(JSON.stringify(this.signup_Form.get('phn_num').value).length < 10)
        {
          return this.translate.instant('PHONE_MINLENGTH')
        }
        else if(this.signup_Form.get('phn_num').hasError('pattern'))
        {
          return this.translate.instant('PHONE_PATTERN');
        }
        return '';
    }
    else if(filed == 'pwd'){
        if(this.signup_Form.get('pwd').hasError('required'))
        {
          return this.translate.instant('PASSWORD_REQUIRED');
        }
        else if(this.signup_Form.get('pwd').hasError('minlength'))
        {
          return this.translate.instant('PASSWORD_MINLENGTH')
        }
        else if(this.signup_Form.get('pwd').hasError('maxlength'))
        {
          return this.translate.instant('PASSWORD_MAXLENGTH')
        }
        else if(this.signup_Form.get('pwd').hasError('pattern'))
        {
          return this.translate.instant('PASSWORD_PATTERN');
        }
        return '';
    }
    else if(filed == 'c_pwd'){
        if(this.signup_Form.get('c_pwd').hasError('required'))
        {
          return this.translate.instant('CONFIRM_PASSWORD_REQUIRED');
        }
        else if(this.signup_Form.get('c_pwd').hasError('minlength'))
        {
          return this.translate.instant('CONFIRM_PASSWORD_MINLENGTH')
        }
        else if((this.signup_Form.get('pwd').value)!=(this.signup_Form.get('c_pwd').value))
        {
          return this.translate.instant('PASSWORD_MISMATCH');
        }
        return '';
    }
    else if(filed == 'referral_code'){
        if(this.signup_Form.get('referral_code').value == ''){
          return '';
        }
        else if(this.signup_Form.get('referral_code').hasError('minlength'))
        {
          return this.translate.instant('REFFERAL_MINLENGTH')
        }
        return '';
    }
    
  }
   //side menu disable before login
  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

}
