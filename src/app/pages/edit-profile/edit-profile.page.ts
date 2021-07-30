import { Component, OnInit } from '@angular/core';
import { UserService, ErrorService, ToastersService } from '../../providers';
import { FormBuilder,FormControl,Validators, FormGroup } from '@angular/forms';
import { NavController, ActionSheetController,Platform , AlertController ,LoadingController,ModalController} from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Base64 } from '@ionic-native/base64/ngx';
import { isCordovaAvailable } from '../../providers/is-cordova-available'

import {States} from '../../providers/json/states-cities';
import { File } from '@ionic-native/file/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Router } from '@angular/router';

declare var window;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  public update_Form:FormGroup;
  userData:any;
  account:any;
  pwd_div:any=false;
  pwdupdate_Form:any;
  msg_div:any=false;
  info_icon:any =false;
  imgPreview:any="assets/img/black_ant.svg.png";
  regData0 = { filename:'avatar',base64file:''};
  imgPreview0:any;
  states:any;
  allstates_cities:any= new States;
  stateId:any='';
  cityId:any='';
  cities:any;
  city_val:any;
  sel_city:any;
  click= false;
  isenabled:any;
  data:any;
  path:any;
  pic:any;
  key:any;
  disable:any=false;
  last_year = new Date().getFullYear()-1;
  fir_nme:any='';
  lst_nme:any='';
  agelimit:any;
  update_Form_touched:boolean =false;
  pwdupdate_Form_touched:boolean =false;
  
  constructor(public navCtrl: NavController,
    private toaster:ToastersService,
    public platform:Platform, 
    public formBuilder: FormBuilder,
    private alertCtrl:AlertController,
    private file: File,
    public camera:Camera,
    public actionSheetCtrl:ActionSheetController,
    public translate: TranslateService,
    private base64: Base64,
    public loadingCtrl: LoadingController,
    public modalController:ModalController,
    public user:UserService,
    public errorService:ErrorService,
    public crop: Crop,
    public router: Router
    ) { 



      this.states=this.allstates_cities.states;
      this.cities = this.allstates_cities.cities[this.user.selected_state];
  }
  
   passwordType: string = 'password';
   passwordIcon: string = 'eye-off';

//hide or show functionality
 hideShowPassword() {
     this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
     this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
 }


 ionViewWillEnter(){  //get user details

 this.user.profileData().subscribe((resp:any)=>{
 this.userData=resp;
 this.fir_nme=resp.first_name;
 this.lst_nme=resp.last_name;
 this.cities = this.allstates_cities.cities[resp.selected_state];
 this.stateId = this.userData.selected_state;
 this.states=this.allstates_cities.states;
 this.cityId = this.userData.selected_city;
 var  year: number = new Date().getFullYear();
 // this.agelimit=year-this.userData.age_limit ;
  // if(this.userData.profile_pic!=null){
  //         this.imgPreview =this.userData.profile_pic;
  //       }
 this.isenabled = true;
 if(this.userData.selected_state==null || this.userData.selected_state=='')
 { 
   this.disable=true;
 }

 
 }, err=>{
    this.errorService.errorsMethod(err)
 })

 }

//form declaration with validation
     
  ngOnInit() {
    this.userData = {firstName:'',lastName:'',email:'',phone:0,address:'',state:'',city:'',currentpwd: '',gender:'',allow_sms:false,pin:'',dob:''};
   this.ionViewwillLoad();

  }
  ionViewwillLoad(){
    this.pwdupdate_Form = this.formBuilder.group({
        oldpwd: new FormControl('', Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15),Validators.pattern('^.*(?=..*[0-9])(?=.*[a-z]{0,12})(?=.*[A-Z])(?=.*[@#$%*&]).*$')])),
        newpwd: new FormControl('', Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15),Validators.pattern('^.*(?=..*[0-9])(?=.*[a-z]{0,12})(?=.*[A-Z])(?=.*[@#$%*&]).*$')])),
        repwd: new FormControl('', Validators.compose([Validators.required,Validators.minLength(8)]))
        
    },{validator:this.checkPwd('newpwd','repwd')});
    this.update_Form = this.formBuilder.group({
        fname: new FormControl(this.userData.firstName, Validators.compose([Validators.minLength(3),Validators.pattern('^[A-Za-z0-9- _.@$&*]+$')])),
        lname: new FormControl(this.userData.lastName, Validators.compose([Validators.minLength(3),Validators.pattern('^[A-Za-z0-9- _.-@$&*]+$')])),
        email: new FormControl(this.userData.email, Validators.compose([Validators.minLength(0),Validators.pattern("[a-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})")])),
        phn_num: new FormControl(this.userData.phone, Validators.compose([Validators.minLength(10),Validators.maxLength(10)])),
        state: new FormControl('',Validators.compose([Validators.required])),
        city: new FormControl('',Validators.compose([Validators.required])),
        address:new FormControl('',this.userData.address),
        currentpwd: new FormControl('', Validators.compose([Validators.required,Validators.minLength(8),Validators.pattern('^.*(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%*&]).*$')])),
        gender:new FormControl('',Validators.compose([Validators.required])),
        allow_sms:new FormControl(false,Validators.compose([])),
        allow_activity:new FormControl(false,Validators.compose([Validators.required])),
        pin:new FormControl('',Validators.compose([Validators.required,Validators.min(100000),Validators.pattern('^[+0-9]{6,6}$')])),
        dob:new FormControl('',Validators.compose([Validators.required]))
    });

  }
   clickst(){
     this.click = true;
    }
 
 //change state method
  change_st($event){
    this.disable=false;
if(this.click) {
 this.data = null ;
  var state_id;
 if(this.city_val == true){
   state_id = $event;
 } else {
   state_id = $event.detail.value;
 } 
 this.cities=this.allstates_cities.cities[state_id];
 
 }
 }
 //password comparision

  checkPwd(newpwd,repwd){
    return (group: FormGroup) => {
            let passwordInput = group.controls[newpwd],
                passwordConfirmationInput = group.controls[repwd];
            if (passwordInput.value !== passwordConfirmationInput.value) {
                return passwordConfirmationInput.setErrors({notEquivalent: true})
            }
            else {
                return passwordConfirmationInput.setErrors(null);
            }
          }
  }

  //update form submission

 async updateSubmit(values:any){
   // console.log(values)
    const loading = await this.loadingCtrl.create({
      spinner:null,
      message:'',
    });
    this.update_Form_touched = true;

    if(this.update_Form.valid){

      const alert = await this.alertCtrl.create({
      header: this.translate.instant('CONFIRMATION')+'!',
      message: this.translate.instant('UPDATE_PROFILE_ALERT'),
      buttons: [
        {
          text: this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.translate.instant('UPDATE_BUTTON'),
          handler: () => {
               loading.present();
               var date=values.dob;
               var birthdate=date.split('T');
            this.account ={firstName:values.fname, lastName: values.lname,email:values.email,phone: values.phn_num,address:values.address,city:this.cityId,state:this.stateId,currentpwd:values.currentpwd,gender:values.gender,allow_sms:values.allow_sms,share_activities_to_followers:values.allow_activity,pin:values.pin,dob:birthdate[0]};
          this.user.proUpdate(this.account).subscribe((resp:any)=>{
        loading.dismiss();
        // if(typeof(resp)=='string'){

        //     this.update_Form.reset();
        //     this.update_Form_touched = false;
        //     this.user.presentsuccessAlert(this.translate.instant('PROFILE_UPDATED'));
        //     this.disable=false;
        //     this.user.selected_state=this.account.state;
            
        //     this.ionViewWillEnter();
        //     return;
        // }
        
          if(resp.code == 12){
            if(resp.excluded_states != "" && resp.excluded_states != null){
              this.user.presentfailAlert(this.translate.instant(resp.message)+' '+resp.excluded_states,'<ion-img src="assets/imgs/warning.png">');
              return;
            }
            this.user.presentfailAlert(this.translate.instant(resp.message),'<ion-img src="assets/imgs/warning.png">');
            return;
          }
          if(resp.code == 13){
            if(resp.minimum_age != ""  && resp.excluded_states != null){
              this.user.presentfailAlert(this.translate.instant(resp.message)+' '+resp.excluded_states,'<ion-img src="assets/imgs/warning.png">');
              return;
            }
            this.user.presentfailAlert(this.translate.instant(resp.message),'<ion-img src="assets/imgs/warning.png">');
            return;
          }
          if(typeof(resp)=='string'){
            this.update_Form.reset();
            this.disable=false;
            this.user.selected_state=this.account.state;
            this.update_Form_touched = false;
            this.ionViewWillEnter();
            this.user.presentsuccessAlert(this.translate.instant(resp));
          }
        },(err)=>{
        loading.dismiss();
        this.errorService.errorsMethod(err)
      })
          }
        }
      ]
    });

    await alert.present();
    }
  }
 //password form submission
  async pwd_update_fun(values:any){
    const loading = await this.loadingCtrl.create({
      spinner:null,
      message:'',
    });
    this.pwdupdate_Form_touched = true;
    if(this.pwdupdate_Form.valid){
     
     const alert = await this.alertCtrl.create({
      header: this.translate.instant('CONFIRMATION')+'!',
      message: this.translate.instant('UPDATE_PWD_ALERT'),
      buttons: [
        {
          text: this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.pwdupdate_Form.reset();
          }
        }, {
          text: this.translate.instant('UPDATE_BUTTON'),
          handler: () => {
             loading.present();
                this.account ={oldPassword:values.oldpwd, newPassword:values.newpwd, repeatPassword:values.repwd};
        this.user.pwdUpdate(this.account).subscribe((resp:any)=>{
          loading.dismiss();
          if(typeof(resp)=='string'){
            this.pwd_div=false;
            this.user.presentsuccessAlert(this.translate.instant('PASSWORD_UPDATED'));
            this.pwdupdate_Form.reset();
            this.ionViewWillEnter();
            return;
          }
          if(resp.code == 0){
            this.pwdupdate_Form.reset();
            this.pwd_div=false;
            this.user.presentsuccessAlert(this.translate.instant(resp.message));
            // this.ionViewWillEnter();
          }
          },(err)=>{
            loading.dismiss();
            this.errorService.errorsMethod(err)       
      })
          }
        }
      ]
    });

    await alert.present();
  }
  else{
    this.pwdupdate_Form.touched = true;

    }
    
  }
  info_fun(show){
    if(show){
      this.msg_div=false;
    }else{
      this.msg_div=true;
    }
  }

  //picture upload here

  async presentActionSheet() {

    let actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant('SELECT_PICTURE'),
      buttons: [
        {
          text: this.translate.instant('GALLERY'),
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: this.translate.instant('CAMERA'),
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel'
        }
      ]
    });
   await actionSheet.present();
  }
async  getPicture(sourceType) {

const loading = await this.loadingCtrl.create({
      spinner:null,
      message:'',
    });

    if(isCordovaAvailable())
  {
    var option_cum:any = { 
      destinationType: this.camera.DestinationType.FILE_URI,   
      quality: 70,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true, };

      this.camera.getPicture(option_cum).then((imageData) => {

        loading.present();
        this.file.resolveLocalFilesystemUrl(imageData)
                 .then(fileEntry => { 
                   fileEntry.getMetadata((metadata) => { 
                     //metadata.size is the size in bytes
                     loading.dismiss();
                     if((metadata.size) > 3000000){
                       
                       this.toaster.warning_presentToast(this.translate.instant('SELECT_DOC_LESS_THAN_2MB'))
                       return false;
                     }
                     this.up_load_pic(imageData);
                   },err=>{
                       loading.dismiss();
                       this.toaster.warning_presentToast(this.translate.instant('SELECT_DOC_LESS_THAN_2MB'))
                       return false;
                   })
        })

      }, (err) => {
        
         if(err == 'No Image Selected')
          {
            this.toaster.warning_presentToast(this.translate.instant('SELECT_IMAGE_TYPE'))
            // console.log('Please select an image')
          }
         
      })
    
  }
  else{
      // alert(sourceType);
    this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
  }
}

async up_load_pic(imageData){
  const loading = await this.loadingCtrl.create({
      spinner:null,
      message:'',
    });
  loading.present();
          this.crop.crop(imageData, {quality: 75})
          .then(
            newImage => 

            {
              loading.dismiss();
              // console.log('new image path is: ' + newImage)

              this.base64.encodeFile(newImage).then((base64File: string) => {
                // console.log(base64File);
                var trim_data=base64File.split(',')
                // console.log(trim_data[1])
                this.regData0.filename= newImage.substr(newImage.lastIndexOf('/') + 1)

                this.file.resolveLocalFilesystemUrl(newImage)
                 .then(fileEntry => { 
                   fileEntry.getMetadata((metadata) => { 
                     //metadata.size is the size in bytes
                     if((metadata.size) > 2000000){
                       this.toaster.warning_presentToast(this.translate.instant('PROFILE_PIC_SIZE'))
                       return false;
                     }
                     else{
                        this.regData0.base64file ='data:image/jpg;base64,'+trim_data[1];
                        //loading
                        loading.present();
                        this.user.upload_pic(this.regData0).subscribe((resp:any) => { 
                        loading.dismiss();         
                        this.user.presentsuccessAlert(this.translate.instant('IMAGE_UPDATED'));
                        this.ionViewWillEnter();
                      }, (err) => {
                         loading.dismiss(); 
                         this.errorService.errorsMethod(err)
                      })
                     }
                         } )
                       })
            }, (err) => {
                // console.log(err);
              });
            },
            error => {
              loading.dismiss();
              // //console.error('Error cropping image', error)
              if(error.code == 404)
              {
                this.toaster.warning_presentToast(this.translate.instant('SELECT_IMAGE_TYPE'))
              }
            }
          );
}




  toggle()
  {
    this.navCtrl.navigateForward("notifications");
  }

// validations
  valid_fun(filed){
    this.pwdupdate_Form.touched = false;
    if(!this.update_Form.touched && !this.update_Form_touched){
      return '';
    }
    if(filed == 'fname'){
      if(this.update_Form.get('fname').hasError('required'))
      {
        return this.translate.instant('FIRST_NAME_REQUIRED');
      }
      else if(this.update_Form.get('fname').hasError('minlength'))
      {
        return this.translate.instant('FIRST_NAME_MINLENGTH');
      }
      else if(this.update_Form.get('fname').hasError('pattern'))
      {
        return this.translate.instant('FIRST_NAME_PATTERN');
      }
        return '';
    }else if(filed == 'lname'){
        if(this.update_Form.get('lname').hasError('required'))
        {
          return this.translate.instant('LAST_NAME_REQUIRED');
        }
        else if(this.update_Form.get('lname').hasError('minlength'))
        {
          return this.translate.instant('LAST_NAME_MINLENGTH')
        }
        else if(this.update_Form.get('lname').hasError('pattern'))
        {
          return this.translate.instant('LAST_NAME_PATTERN');
        }
        return '';
    }
    else if(filed == 'email'){
        if(this.update_Form.get('email').hasError('required'))
        {
          return this.translate.instant('EMAIL_REQUIRED');
        }
        else if(this.update_Form.get('email').hasError('pattern'))
        {
          return this.translate.instant('EMAIL_PATTERN');
        }
        return '';
    }
    else if(filed == 'phn_num'){
        if(this.update_Form.get('phn_num').hasError('required'))
        {
          return this.translate.instant('PHONE_REQUIRED');
        }
        else if(this.update_Form.get('phn_num').hasError('minlength'))
        {
          return this.translate.instant('PHONE_MINLENGTH')
        }
        else if(JSON.stringify(this.update_Form.get('phn_num').value).length < 10)
        {
          return this.translate.instant('PHONE_MINLENGTH')
        }
        else if(this.update_Form.get('phn_num').hasError('pattern'))
        {
          return this.translate.instant('PHONE_PATTERN');
        }
        return '';
    }
    else if(filed == 'dob'){
        if(this.update_Form.get('dob').hasError('required'))
        {
          return this.translate.instant('DATE_OF_BIRTH_REQUIRED');
        }
        
        return '';
    }
    else if(filed == 'gender'){
        if(this.update_Form.get('gender').hasError('required'))
        {
          return this.translate.instant('GENDER_REQUIRED');
        }
        
        return '';
    }
    else if(filed == 'state'){
        if(this.update_Form.get('state').hasError('required'))
        {
          return this.translate.instant('STATE_REQUIRED');
        }
        
        return '';
    }
    else if(filed == 'city'){
        if(this.update_Form.get('city').hasError('required'))
        {
          return this.translate.instant('CITY_REQUIRED');
        }
        
        return '';
    }
    else if(filed == 'address'){
        if(this.update_Form.get('address').hasError('required'))
        {
          return this.translate.instant('ADDRESS_REQUIRED');
        }
        
        return '';
    }
    else if(filed == 'pin'){
        if(this.update_Form.get('pin').hasError('required'))
        {
          return this.translate.instant('PINCODE_REQUIRED');
        }
        else if(this.update_Form.get('pin').hasError('min'))
        {
          return this.translate.instant('PIN_PATTERN')
        }
        
        return '';
    }
    else if(filed == 'currentpwd'){
        if(this.update_Form.get('currentpwd').hasError('required'))
        {
          return this.translate.instant('PASSWORD_REQUIRED');
        }
        else if(this.update_Form.get('currentpwd').hasError('minlength'))
        {
          return this.translate.instant('PASSWORD_MINLENGTH')
        }
        else if(this.update_Form.get('currentpwd').hasError('maxlength'))
        {
          return this.translate.instant('PASSWORD_MAXLENGTH')
        }
        else if(this.update_Form.get('currentpwd').hasError('pattern'))
        {
          return this.translate.instant('PASSWORD_PATTERN');
        }
        return '';
    }
   
  }

  pwd_fun(filed){
    this.update_Form_touched = false;
     if(!this.pwdupdate_Form.touched && !this.pwdupdate_Form_touched){
      return '';
    }

    else if(filed == 'oldpwd'){
        if(this.pwdupdate_Form.get('oldpwd').hasError('required'))
        {
          return this.translate.instant('OLD_PASSWORD_REQUIRED');
        }
        else if(this.pwdupdate_Form.get('oldpwd').hasError('minlength'))
        {
          return this.translate.instant('OLD_PASSWORD_MINLENGTH')
        }
        else if(this.pwdupdate_Form.get('oldpwd').hasError('maxlength'))
        {
          return this.translate.instant('PASSWORD_MAXLENGTH')
        }
        else if(this.pwdupdate_Form.get('oldpwd').hasError('pattern'))
        {
          return this.translate.instant('PASSWORD_PATTERN');
        }
        return '';
    }
    else if(filed == 'newpwd'){
        if(this.pwdupdate_Form.get('newpwd').hasError('required'))
        {
          return this.translate.instant('NEW_PASSWORD_REQUIRED');
        }
        else if(this.pwdupdate_Form.get('newpwd').hasError('minlength'))
        {
          return this.translate.instant('NEW_PASSWORD_LENGTH')
        }
        else if(this.pwdupdate_Form.get('newpwd').hasError('maxlength'))
        {
          return this.translate.instant('PASSWORD_MAXLENGTH')
        }
        else if(this.pwdupdate_Form.get('newpwd').hasError('pattern'))
        {
          return this.translate.instant('PASSWORD_PATTERN');
        }
        return '';
    }
    else if(filed == 'repwd'){
        if(this.pwdupdate_Form.get('repwd').hasError('required'))
        {
          return this.translate.instant('CONFIRM_PASSWORD_REQUIRED');
        }
        else if(this.pwdupdate_Form.get('repwd').hasError('minlength'))
        {
          return this.translate.instant('CONFIRM_PASSWORD_MINLENGTH')
        }
        else if((this.pwdupdate_Form.get('newpwd').value)!=(this.pwdupdate_Form.get('repwd').value))
        {
          return this.translate.instant('PASSWORD_MISMATCH');
        }
        return '';
    }
  }

}
