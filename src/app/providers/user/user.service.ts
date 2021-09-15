import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { share } from "rxjs/operators";
import {AlertController} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class UserService {
    _user: any;
  token:any = JSON.parse(localStorage.getItem('token'));
  userId:any = localStorage.getItem('userId');
  _path:any;
   fall_val:any;
  personal_count:any=0;other_count:any=0;

  selected_state:any;
  
  payment_type:any;
 
  dest:any;
  wallet_balance:any;
  username:any;
  user_pic:any;
  referral_code:any;
  user_level:any;
  user_suspend:any;
  followees_count:any=0;
  followers_count:any=0;
  notification_count:any=0;
  element_toast:any;
  tst_msg:any = '';
  element_alert:any;

  constructor(private api:ApiService,private alertCtrl:AlertController,private translate: TranslateService) { }


  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
   login(accountInfo: any) {
    let data = {session:accountInfo}
    let seq = this.api.post('session', data).pipe(share());
    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let data = {
      user:{
        email:accountInfo.email,
        password:accountInfo.password,
        password_confirmation:accountInfo.confirm_password,
        phone: JSON.stringify(accountInfo.phone),
        first_name:accountInfo.firstName,
        last_name:accountInfo.lastName,
        referral_code:accountInfo.referral_code,
        registered_from:'app'
      }

    }
    // console.log(data);
    let seq = this.api.post('registration', data).pipe(share());

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }
  forgetpassword(value: any){
    let data={
        
          email:value.username
       
    }
    let seq = this.api.post('reset_passwords',data).pipe(share());
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
    }, err => {
      console.error('ERROR', err);
    });

    return seq;

  }
  //resend confirmation
  sendConfirm(email)
  {
    let data={
      confirmation:{
        email:email}
    }
      let seq = this.api.post('confirmations',data).pipe(share());
    seq.subscribe((res: any) => {     
    }, err => {
      //console.error('ERROR', err);
    });
    return seq;
  }
  resetpassword(value: any){
    let data={
          verification_code:value.verification_code,
          password:value.password,
          phone:value.phone_number
    }
    let seq = this.api.put('change_password',data).pipe(share());
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
    }, err => {
      //console.error('ERROR', err);
    });

    return seq;

   }
    verify_otp(value: any){
     let data={
       email: value.email,
       verification_code:value.otp 
      }
    let seq = this.api.post('verify_otp',data).pipe(share());
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
    }, err => {
      //console.error('ERROR', err);
    });

    return seq;

   }
   resend_otp(email)
  {
    let data={
       email:email
    }
      let seq = this.api.post('resend_otp',data).pipe(share());
    seq.subscribe((res: any) => {     
    }, err => {
      //console.error('ERROR', err);
    });
    return seq;
  }


   login_resend_otp(email)
  {
    let data={
       email:email,
       login_with_otp:'true'
    }
      let seq = this.api.post('resend_otp',data).pipe(share());
    seq.subscribe((res: any) => {     
    }, err => {
      //console.error('ERROR', err);
    });
    return seq;
  }

   //update phone
  changeNumber(email,phone)
  {
    let data={
       email:email,
       phone:phone
    }
      let seq = this.api.post('update_number_and_send_otp',data).pipe(share());
     seq.subscribe((res: any) => {     
    }, err => {
      //console.error('ERROR', err);
    });
    return seq;
  }
  affiliate_summary(page)
  {
    let seq = this.api.get('affiliate_summary?page='+page).pipe(share());
           seq.subscribe((res: any) => {
     }, err => {
       console.error('ERROR', err);
     });

     return seq;
  }
  affiliate_history(page)
  {
    let seq = this.api.get('affiliate_history?page='+page).pipe(share());
           seq.subscribe((res: any) => {
     }, err => {
       console.error('ERROR', err);
     });

     return seq;
  }
  follow_up(postData)
{
   let seq = this.api.post('follow_up',postData).pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}
getBanks()
  {
    let seq = this.api.get('bank_accounts').pipe(share());
      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  
  }
  bonus_history(page)
{
  let seq = this.api.get('bonus_history?page='+page).pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     console.error('ERROR', err);
   });

   return seq;

}

download_statements(postData){
  let seq = this.api.post('download_statements',postData).pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
  }
  bonus_summary(page)
{
  let seq = this.api.get('bonus_summary?page='+page).pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     console.error('ERROR', err);
   });

   return seq;

}
deposit_summary(page)
  {
    let seq = this.api.get('deposit_summary?page='+page).pipe(share());
           seq.subscribe((res: any) => {
      
     }, err => {
       console.error('ERROR', err);
     });

     return seq;

  }
  deposit_history(page)
  {
    let seq = this.api.get('deposit_history?page='+page).pipe(share());
           seq.subscribe((res: any) => {
      
     }, err => {
       console.error('ERROR', err);
     });

     return seq;

  }
  winning_summary(page)
  {
    let seq = this.api.get('winning_summary?page='+page).pipe(share());
           seq.subscribe((res: any) => {
      
     }, err => {
       console.error('ERROR', err);
     });

     return seq;

  }
  winning_history(page)
  {
    let seq = this.api.get('winning_history?page='+page).pipe(share());
           seq.subscribe((res: any) => {
      
     }, err => {
       console.error('ERROR', err);
     });

     return seq;
  }

//Total friends joined count

getFriendsCount()
{
 let seq = this.api.get('invited_friends_count').pipe(share());
         seq.subscribe((res: any) => {
   
    }, err => {
     //console.error('ERROR', err);
   });

   return seq; 
}

//Referrals

getFriends()
{
 let seq = this.api.get('friends_list').pipe(share());
         seq.subscribe((res: any) => {
    
   }, err => {
     //console.error('ERROR', err);
   });

   return seq; 
}

getNotes(page)
  {
    let seq = this.api.get('get_notifications?page='+page).pipe(share());
      seq.subscribe((res: any) => {
        }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }
get_offers(page)
{
  let seq = this.api.get('get_offers?page='+page).pipe(share());
         seq.subscribe((res: any) => {
    }, err => {
     //console.error('ERROR', err);
   });

   return seq; 
}

get_coupons(page)
{
  let seq = this.api.get('get_coupons?page='+page).pipe(share());
         seq.subscribe((res: any) => {
    }, err => {
     //console.error('ERROR', err);
   });

   return seq; 
}
offer_details_for_coupon(coupon_id)
  {
    let seq = this.api.get('offers_details_for_coupons?id='+coupon_id).pipe(share());
           seq.subscribe((res: any) => {
      
     }, err => {
       //console.error('ERROR', err);
     });

     return seq; 
  }

avalible_payment()
{
  let seq = this.api.get('get_available_payments').pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}



  // Phone pe payment
  
  get_phone_exists()
{
  let seq = this.api.get('check_numbers_linked').pipe(share());
         seq.subscribe((res: any) => {
    }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}
  phone_pe_otp(data)
{
  let seq = this.api.post('send_phonepe_otp',data).pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}

easebuzz_initiate_payment(data)
{
  let seq = this.api.post('easebuzz_initiate_payment',data).pipe(share());
         seq.subscribe((res: any) => {

     if (res.status == 'success') {
     } else {

     }
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}
pay_on_cashfree(data)
{
  let seq = this.api.post('cash_free_create_order',data).pipe(share());
         seq.subscribe((res: any) => {

     if (res.status == 'success') {
       
     } else {

     }
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}
 getRazorpay_credentials(){
   let seq = this.api.get('razorpay_credentials').pipe(share());
         seq.subscribe((res: any) => {
    
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
 }


cash_free_status(data)
{
  let seq = this.api.post('cash_free_get_order_status',data).pipe(share());
         seq.subscribe((res: any) => {

     if (res.status == 'success') {
       
     } else {

     }
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}

  add_Amount(amount:any){
    var data={amount:amount};
    let seq = this.api.post('walletadd',data).pipe(share());
    seq.subscribe((res: any) => {     
        
      
    }, err => {
      //console.error(err.error);
    });
    return seq;

  }
   paymentgateway(requestid)
   {
      let data={
      payment_request_id:requestid
    }
    let seq = this.api.post('check_wallet_add_status',data).pipe(share());
      seq.subscribe((res: any) => {
        
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
   }

 
  razorpay(data)
{
  let seq = this.api.post('razorapay_wallet',data).pipe(share());
         seq.subscribe((res: any) => {

     if (res.status == 'success') {
       
     } else {

     }
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}

  remove_phn_num(data)
  {
    let seq = this.api.post('remove_phone_number',data).pipe(share());
         seq.subscribe((res: any) => {
    
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
  }
    profileData(){
     let seq = this.api.get('user_info','').pipe(share());
    seq.subscribe((res: any) => {     
    }, err => {
      //console.error('ERROR', err);
    });
    return seq;

  }

   /**
   * PROFILE UPDATE FOR user 
   */

  proUpdate(value){
     var data = {
         profile:{
             email:value.email,
             first_name:value.firstName,
             last_name:value.lastName,
             phone:JSON.stringify(value.phone),
             current_password:value.currentpwd,
             state:value.state,
             city:value.city,
             address:value.address,
             country:'IN',
             gender:value.gender,
             allow_sms:value.allow_sms,
             share_activities_to_followers:value.share_activities_to_followers,
             date_of_birth:value.dob,
             pin_code:value.pin
           }
       };
     let seq = this.api.put('profile',data).pipe(share());
      seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
    }, err => {
      //console.error('ERROR', err);
    });

    return seq;

   }

   pwdUpdate(data){
       let details={
         profile:{
           password:data.newPassword,
           current_password:data.oldPassword
         }
       };
       // let reqOpts;
       //  reqOpts = this.api._initializeReqOpts(reqOpts,this.token);
       let seq = this.api.put("/profile/password",details).pipe(share());
        seq.subscribe((res: any) => {
        // If the API returned a successful response, mark the user as logged in
      }, err => {
        //console.error('ERROR', err);
      });

      return seq;
   }

  /**
   * Process a login/signup response to store user data
   */

  upload_pic(pic:any){
    let data={
      image:{
        base64:pic.base64file,
        filename:pic.filename,
        content_type:'image/jpg'
      }
    }
      let seq = this.api.put('upload_image', data).pipe(share());
    seq.subscribe((res: any) => {     
    }, err => {
      //console.error('ERROR', err);
    });
    return seq;

  } 


  pinenter(pin, email){

    var data = {
      email:email,
      pin:pin

    }
    let seq = this.api.post('set_pin', data).pipe(share());
      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }
    pinsubmit(pin, email){

    var data = {session: {
      email:email,
      pin:pin,
      login_type:'pin'
    }
  }

    let seq = this.api.post('session', data).pipe(share());
      seq.subscribe((res: any) => {
     }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }

  verifykey(email,key)
  {
    let data={
      verification_code:key,
      email:email
    }
    let seq = this.api.post('verify2fa',data).pipe(share());
      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }
    get_all_coupons(page)
  {
    let seq = this.api.get('get_all_coupons?page='+page).pipe(share());
           seq.subscribe((res: any) => {
       
     }, err => {
       //console.error('ERROR', err);
     });

     return seq; 
  }
  get_settings_data(){
  let seq = this.api.get('get_settings_data').pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;

}
//app update version
 version()
 {
   let seq = this.api.get('triggers/version').pipe(share());
         seq.subscribe((res: any) => {
    }, err => {
     //console.error('ERROR', err);
   });

   return seq;
 }

   /**
   * Log the user out, which forgets the session
   */
  logout() {
    var value={};
    // let reqOpts;
    //   reqOpts = this.api._initializeReqOpts(reqOpts,this.token);
     let seq = this.api.delete('session').pipe(share());
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
    }, err => {
      //console.error('ERROR', err);
    });

    return seq;
  }
//GOOGLE 2FA

  google_2fa()
  {
    let seq = this.api.get('secret_key').pipe(share());
      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }
  generate_newkey()
  {
      let seq = this.api.get('generate_new_key').pipe(share());
      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }
  enable2fa(data)
  {
    let details={
      enable:data.isEnabled,
      verification_code:data.key,
      email:data.email

    }
    let seq = this.api.post('enable_disable_2fa',details).pipe(share());
      seq.subscribe((res: any) => {
        
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }
    sendmail()
  {
    let seq = this.api.get('send_backup_code_mail').pipe(share());
           seq.subscribe((res: any) => {
     }, err => {
       //console.error('ERROR', err);
     });

     return seq;
  }
  enable_or_disable_settings(postData){
  let seq = this.api.put('enable_or_disable_settings',postData).pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}
invite_friends_from_phone_book(postData){
  let seq = this.api.post('invite_friends_from_phone_book',postData).pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}

  //Refer a friend and earn

  inviteFriend(email)
  {
    let data={
      email:email
    }
    let seq = this.api.post('invitations',data).pipe(share());
           seq.subscribe((res: any) => {
     }, err => {
       //console.error('ERROR', err);
     });

     return seq;
  }

   check_suspend_account()
 {
    let seq = this.api.get('get_suspend_details').pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;

 }
  suspend_account(type)
 {
   let data={
     type:type
   }
    let seq = this.api.post('suspend_account',data).pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
 }
  getTransactions(data)
  {

    let seq = this.api.get('transaction_histories?start='+data.startDate+'&end='+data.endDate+'  '+'23:59:59' + '&page='+data.page).pipe(share());

      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }
  getTransaction(id)
  {
    let seq = this.api.get('transaction_details/'+id).pipe(share());
      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }
    //other user info

  get_user_data(user_id)
  {
    let seq = this.api.get('follower_followee_page?user_id='+user_id).pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
  }
  kyc_status(){
  let seq = this.api.get('kyc_status').pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;

}
get_address_proofs_list(){
  let seq = this.api.get('get_address_proofs_list').pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;

}
get_id_proofs_list(){
  let seq = this.api.get('get_id_proofs_list').pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;

}
upload_address_proof(postData){
  let seq = this.api.post('upload_address_proof',postData).pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}
upload_id_proof(postData){
  let seq = this.api.post('upload_id_proof',postData).pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}
over_all_kyc_status()
{
   let seq = this.api.get('over_all_kyc_status').pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;

}
 upload_pan_card(data)
{
  let seq = this.api.post('upload_pan_card',data).pipe(share());
         seq.subscribe((res: any) => {

     if (res.status == 'success') {
     } else {

     }
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}

 //add banks
  addBank(values,proof)
  {
   
       var data ={
         bank_account: {
            account_name:values.value.holder_name,
            account_number:values.value.account_number,
            bank_name:values.value.bank_name,
            ifsc_code:values.value.ifsc_code,
            account_type:values.value.account_type,
            branch_name:values.value.branch_name,
            city:values.value.city_name,
            state:values.value.state_name,
            nick_name:values.value.nick_name,
            proof:proof

    }

  }
  let seq = this.api.post('bank_accounts', data).pipe(share());
      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }

public setDestn(destn) {
    this.dest = destn;
    // console.log("checking",destn)
  }

  getDestn() {
    return this.dest;
  }
  check_deposit_status(){
   let seq = this.api.get('check_deposit_status').pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
 }
 addWithdraw(values)
  {
    var data ={
         
            amount:values.value.withdrawal_amount,
            bank_account_id:values.value.bank_name,
           
      }
      // console.log(data);
  let seq = this.api.get('withdraws/new?amount='+data.amount+'&bank_account_id='+data.bank_account_id).pipe(share());
      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }
  get_bank_account(){
    let seq = this.api.get('get_bank_account').pipe(share());
           seq.subscribe((res: any) => {
     }, err => {
       console.error('ERROR', err);
     });

     return seq;
  }
  getWithdrawBanks()
{
  let seq = this.api.get('withdraw_banks_list').pipe(share());
      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
}
  getWithdraws(data)
  {
    let seq = this.api.get('withdraws?start='+data.startDate+'&end='+data.endDate+'  '+'23:59:59' + '&page='+data.page).pipe(share());
      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }

  confirmWithdraw(values)
  {
      var data ={
         withdraw:{
            amount:values.value.withdrawal_amount,
            bank_account_id:values.value.bank_name,
          } 
      }
      // console.log(data);
  let seq = this.api.post('withdraws',data).pipe(share());
      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }
    cancel_Withdraw(value)
  {
    var data={
      withdraw_number:value
    }
    let seq = this.api.post('cancel_withdraw',data).pipe(share());
      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  }
     
   //user data for side menu

    get_user_summary()
    {
      let seq = this.api.get("user_info").pipe(share());
        seq.subscribe((res: any) => {
        // If the API returned a successful response, mark the user as logged in
      }, err => {
        //console.error('ERROR', err);
      });

      return seq;
    }
    get_wallet_balance(){
  let seq = this.api.get('wallet_balance').pipe(share());
         seq.subscribe((res: any) => {
   }, err => {
     //console.error('ERROR', err);
   });

   return seq;
}

//Alerts
async presentsuccessAlert(msg) {

    const alert = await this.alertCtrl.create({
      header: msg,
      message: '<ion-img src="assets/imgs/right_mark.gif">',
      buttons:['Ok'],
      cssClass:'alert_succ_img'
    });

    await alert.present();
    
  }
async presentfailAlert(msg,img) {


      const alert = await this.alertCtrl.create({
          header: msg,
          message: img,
          buttons:['Ok'],
          cssClass:'alert_fail_img'
        });
    
        await alert.present();

}
translateLanguage()
 {
   // this.getTranslation();
    var lang=localStorage.getItem('LANG');
   if(lang!=null){
     this.translate.setDefaultLang(lang);
    this.translate.use(lang);
   }
 else
     {
     lang='en';
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
       localStorage.setItem('LANG','en');
     }
 }


  send_qr_url()
     {
       let seq = this.api.get('generate_new_qr_code').pipe(share());
         seq.subscribe((res: any) => {
         }, err => {
           //console.error('ERROR', err);
         });

         return seq;
     }

     available_languages()
  {
    let seq = this.api.get('available_languages').pipe(share());
      seq.subscribe((res: any) => {
      }, err =>{
          //console.error('ERROR', err);
       });
        return seq;
  
  }

  get_language_files(lang){
   
   let seq = this.api.get('get_language_files?keyterm='+lang).pipe(share());
         seq.subscribe((res: any) => {

   }, err => {
     //console.error('ERROR', err);
   });

   return seq;

 }

  get_frequently_asked_questions(){
   
   let seq = this.api.get('get_frequently_asked_questions').pipe(share());
         seq.subscribe((res: any) => {

   }, err => {
     //console.error('ERROR', err);
   });

   return seq;

 }


  
}
