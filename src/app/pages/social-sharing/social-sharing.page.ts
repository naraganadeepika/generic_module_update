import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { isCordovaAvailable } from '../../providers/is-cordova-available'
import { UserService, ErrorService, ToastersService } from '../../providers';
import { FormBuilder,FormControl,Validators,FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';
import {LoadingController,NavController } from '@ionic/angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';

@Component({
  selector: 'app-social-sharing',
  templateUrl: './social-sharing.page.html',
  styleUrls: ['./social-sharing.page.scss'],
})
export class SocialSharingPage implements OnInit {
  Contact_book:any;
  all_Contacts:any=[];
  public invite_Form_email:FormGroup;
    account: { email: any,} = {
      email: ''
    };
  no_friends:any='';
  no_friends_enable:boolean=false;
  total:any=0;
  err_msg:any='';
  success_msg:any='';
  touched_Form:boolean=false;
  constructor(
    private contacts: Contacts,
    private socialSharing: SocialSharing,
    public user:UserService,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    private iab: InAppBrowser,
    public alertController: AlertController,
    public loadingCtrl:LoadingController,
    public navCtrl:NavController,
    public errorService:ErrorService,private toaster:ToastersService,
  ) {
    
   }
   

  ngOnInit() {
    this.invite_Form_email = this.formBuilder.group({
        email: new FormControl('', Validators.compose([Validators.required])),
      });
    
  }

  ionViewWillEnter(){
   this.getData();
  }

  //get count of friends joined

  async getData()
  {
    const loading = await this.loadingCtrl.create({
      spinner:null,
      message:'loading',
    }); 
     loading.present();

    this.user.getFriendsCount().subscribe((resp:any) => { 
       // code4:For error messages and no data messages
        if(resp.code == 4){
         this.user.referral_code=resp.invitation_token;
         this.no_friends=this.translate.instant(resp.message);
         this.no_friends_enable=true;
         loading.dismiss();
        }           
        else
        {
          this.user.referral_code=resp.invitation_token;
          this.no_friends_enable=false;
          this.total=resp.invited_users_count;
          loading.dismiss();
        }

    },(err)=>{
      this.errorService.errorsMethod(err)
      loading.dismiss();
    })
  }

  //submit form method (register your friends here)
  async join() {
    const loading = await this.loadingCtrl.create({
      spinner:null,
      message:'loading',
    }); 
     
    if(this.invite_Form_email.valid)
    {
      this.account.email=this.invite_Form_email.value.email;
      // console.log(this.account.email);
      loading.present();
      this.user.inviteFriend(this.account.email).subscribe((resp:any) => {
        loading.dismiss();
                  this.touched_Form=false;
                 this.invite_Form_email.reset();
                 this.err_msg = this.translate.instant(resp);

                 setTimeout(() => {
                   this.err_msg = '';
                 },5000)
                 // this.user.presentToast(this.translate.instant(resp));
               },(err)=>{
                 loading.dismiss();
                this.errorService.errorsMethod(err)
               });
    }else{
      this.touched_Form = true;
    }
   }
  cancel()
   {
     console.log('hi');
     this.invite_Form_email.reset();
     this.err_msg = '';
     this.success_msg='';
   }

 //share app to friends via whatsapp

  shareViaWhatsapp(code)
  {
   if(isCordovaAvailable())
    {
      var path=environment.web_path+"/app-invitation ";
      var msg=this.translate.instant('SHARE_MSG1')+" "+path+" "+this.translate.instant('SHARE_MSG2')+' " '+code+' " '+this.translate.instant('SHARE_MSG3')
   
   this.socialSharing.shareViaWhatsApp(msg, null, null).then(() => {
          // Success!
          // alert('success')
        }).catch(() => {
          // Error!
        });
    }
    else{
      this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'))
    }
  }
//share app to friends via gmail,messages etc

  sharewithOptions(code)
  {
    if(isCordovaAvailable())
    {
      var path=environment.web_path+"/app-invitation ";
      var msg=this.translate.instant('SHARE_MSG1')+" "+path+" "+this.translate.instant('SHARE_MSG2')+' " '+code+' " '+this.translate.instant('SHARE_MSG3')
        // Share via email
        this.socialSharing.share(msg,null,null,null).then(() => {
          // Success!
          // alert('success')
        }).catch(() => {
          // Error!
        });
   }
   else{
      this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'))
    }
  }
 //open how it works page via inapp browser

  working()
  {
    if(isCordovaAvailable())
        {
          const browser = this.iab.create(environment.web_path+'/how-it-works','_blank', 'location=yes');
        }
        else
        {
          this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
        } 
  }
//alert for rules of fair play

  async rules()
  {
    var msg=this.translate.instant('RULES_OF_FAIRTXT1')+"<ul><li>"+this.translate.instant('RULES_OF_FAIRTXT2')+"</li><li>"+this.translate.instant('RULES_OF_FAIRTXT3')+"</li><li>"+this.translate.instant('RULES_OF_FAIRTXT4')+"</li></ul>"+this.translate.instant('RULES_OF_FAIRTXT5')+"<ul><li>"+this.translate.instant('RULES_OF_FAIRTXT6')+"<br><b>"+this.translate.instant('RULES_OF_FAIRTXT7')+"</b></li><li>"+this.translate.instant('RULES_OF_FAIRTXT7')+"<br><b>"+this.translate.instant('RULES_OF_FAIRTXT8')+"</b></li></ul>"+this.translate.instant('RULES_OF_FAIRTXT9')+' '+this.translate.instant('RULES_OF_FAIRTXT10')    
    const alert = await this.alertController.create({
      message: msg,
      buttons: [
        {
          text: this.translate.instant('T_CS'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            if(isCordovaAvailable())
            {
              const browser = this.iab.create(environment.web_path+'/terms-conditions','_blank', 'location=yes');
            }
            else
            {
              this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
            } 
            
          }
        }, {
          text: this.translate.instant('OK_BUTTON'),
          handler: () => {
            
          }
        }
      ]
    });

    await alert.present();
  }



  toggle()
  {
    this.navCtrl.navigateForward("notifications");
  }


  get_contacts(){
    if(isCordovaAvailable())
    {
    var phone_book:any =this.contacts.find(["*"]);
    // console.log(phone_book);
    setTimeout(() => {
      // this.Contact_book = phone_book['ZoneAwarePromise']['__zone_symbol__value'];
      this.send_contacts(phone_book['__zone_symbol__value']);
    },2000)
    }else
        {
          this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
        }
   
  
  }
  async send_contacts(phone_book:any){
    const loading = await this.loadingCtrl.create({
      spinner:null,
      message:'loading',
    }); 
     loading.present();
    this.Contact_book = phone_book;
    // console.log(this.Contact_book[0].phoneNumbers[0].value);
    this.Contact_book.forEach((contact:any)=>{
      // console.log(contact.phoneNumbers);
      if(contact.phoneNumbers!=null){
        contact.phoneNumbers.forEach((sub_contact:any)=>{
        // console.log(sub_contact.value);
          this.all_Contacts.push(sub_contact.value);
        })
      }

    //   // console.log(contact);
    //   // console.log(contact.phoneNumbers);
    //   
      
    })


    setTimeout(() => {
      loading.dismiss();
      var postData = {phone_book:this.all_Contacts}
      this.user.invite_friends_from_phone_book(postData).subscribe((resp:any)=>{
        if(resp.code ==0){
          this.success_msg = resp.message;
        }
      },err=>{
        this.errorService.errorsMethod(err);
        
      })
    },3000);

    setTimeout(() => {
      this.cancel();
    },10000)
    

    

  }
  valid_fun(filed){
    if(!this.invite_Form_email.touched && !this.touched_Form ){
      return '';
    }
    if(filed == 'email'){
      if(this.invite_Form_email.get('email').hasError('required'))
      {
        return this.translate.instant('EMAIL_REQUIRED');
      }
      else if(this.invite_Form_email.get('email').hasError('pattern'))
      {
        return this.translate.instant('EMAIL_PATTERN');
      }
        return '';
    }
  }


}
