import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NavController,ActionSheetController,LoadingController,MenuController,AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserService, ErrorService, ToastersService } from '../../providers';
import { isCordovaAvailable } from '../../providers/is-cordova-available'
import { Base64 } from '@ionic-native/base64/ngx';
import { File } from '@ionic-native/file/ngx';
import { FormBuilder,FormControl,Validators,FormGroup } from '@angular/forms';
import { Banks } from '../../providers/json/banks';
import { States } from '../../providers/json/states-cities';


@Component({
  selector: 'app-upload-docs',
  templateUrl: './upload-docs.page.html',
  styleUrls: ['./upload-docs.page.scss'],
})
export class UploadDocsPage  {
  addressproof:any;
  KYC_status:any;
  selected_doc_type:any;
  selected_proof_type:any = '';
  selected_side:any='';
  proofs_list:any;
  proof_front = { filename:'',base64:null};
  proof_back = { filename:'',base64:null};
  pan_card = { filename:'pan_card',base64:null};
  allowed_sides:any;
  expiry_dates:any;
  proof_number:any='';
  proof_expiry_date:any='';
  upload_Form_touched:boolean = false;
  datemaxlimit = new Date().getFullYear()+50;
  dateminlimit = new Date().getFullYear()+'-'+this.get_Month();

  public bankForm: FormGroup;
  submitted:boolean =false;
  touched_bankForm:boolean=false;
  bank_passbook_err_msg:any = '';
  proof = { filename:'bank_doc',base64:null};
  bankUpload:boolean=false;
  banks:any = new Banks;
  all_cities:any= new States().cities;
  states:any =  new States().states;
  cities:any=[];
  constructor(public navCtrl: NavController,public user:UserService,
              public alertController: AlertController,
              private formBuilder: FormBuilder,
              public translate: TranslateService,
              private camera: Camera,
              public loadingCtrl: LoadingController,
              private base64: Base64,
              public menu: MenuController,
              private toaster:ToastersService,
              public loadingController: LoadingController,
              public actionSheetCtrl:ActionSheetController,
              public errorService:ErrorService,
              private file: File,
             ){
    this.get_Status();
  }
  get_Month(){
    var temp_get_Month:any = new Date().getMonth();
    var month :any = parseInt(temp_get_Month)+2
    if(month<10){
      return '0'+month;
    }else{
      return month
    }
  }

  get_Status(){
    this.user.kyc_status().subscribe((resp:any) => {
      this.KYC_status = resp;
    },err=>{
      this.errorService.errorsMethod(err);
    })
  }


  ngOnInit() {
     this.banks = this.banks.banks;
     this.bankForm = this.formBuilder.group({
            nick_name: ['', [Validators.required, Validators.minLength(3),Validators.pattern('^([A-Za-z0-9 .]{3,})+')]],
            holder_name: ['', [Validators.required, Validators.minLength(3),Validators.pattern('^([A-Za-z0-9 .]{3,})+')]],
            account_number: ['', [Validators.required,Validators.min(10000),Validators.pattern('^([0-9])+')]],
            account_type: ['', [Validators.required]],
            bank_name: ['', [Validators.required]],
            branch_name: ['', [Validators.required, Validators.minLength(3),Validators.pattern('^([A-Za-z0-9 .]{3,})+')]],
            ifsc_code: ['', [Validators.required,Validators.pattern('^[A-Z]{4}[0][A-Z0-9]{6}$')]],
            city_name: ['', [Validators.required]],
            state_name: ['', [Validators.required]],
            bank_doc:['']
        })
  }
   
 toggle()
  {
    this.navCtrl.navigateForward("notifications");
  }

  
  //side menu before login

ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }
  address_swiper(type_of_doc)
  {
    this.selected_doc_type = type_of_doc;
    
    if(type_of_doc == 'address_proof'){
      if(this.KYC_status.address_proof_status == 'accepted'){
        this.toaster.warning_presentToast(this.translate.instant('ADDRESS_PROOF_ACCEPTED'));
        return;
      }else if(this.KYC_status.address_proof_status == 'pending'){
        this.toaster.warning_presentToast(this.translate.instant('ADDRESS_PROOF_UNDER_REVIEW'));
        return;
      }
      this.user.get_address_proofs_list().subscribe((resp:any)=>{
        this.proofs_list = resp.allowed_address_proofs;
        this.allowed_sides = resp.allowed_sides;
        this.expiry_dates = resp.allowed_sides.expiry_dates;
      },err=>{
        this.errorService.errorsMethod(err);
      })
    }else if(type_of_doc == 'id_proof'){
      if(this.KYC_status.id_proof_status == 'accepted'){
        this.toaster.warning_presentToast(this.translate.instant('ID_PROOF_ACCEPTED'));
        return;
      }else if(this.KYC_status.id_proof_status == 'pending'){
        this.toaster.warning_presentToast(this.translate.instant('ID_PROOF_UNDER_REVIEW'));
        return;
      }
      this.user.get_id_proofs_list().subscribe((resp:any)=>{
        this.proofs_list = resp.allowed_id_proofs;
        this.allowed_sides = resp.allowed_sides;
        this.expiry_dates = resp.allowed_sides.expiry_dates;
      },err=>{
        this.errorService.errorsMethod(err);
      })
    }else if(type_of_doc == 'back_account')
    {
      if(this.KYC_status.bank_account_status == 'accepted'){
        this.toaster.warning_presentToast(this.translate.instant('BANK_ACCOUNT_ACCEPTED'));
        return;
      }else if(this.KYC_status.bank_account_status == 'pending'){
        this.toaster.warning_presentToast(this.translate.instant('BANK_ACCOUNT_UNDER_REVIEW'));
        return;
      }
    }else{
      if(this.KYC_status.pan_card_status == 'accepted'){
        this.toaster.warning_presentToast(this.translate.instant('PAN_CARD_ACCEPTED'));
        return;
      }else if(this.KYC_status.pan_card_status == 'pending'){
        this.toaster.warning_presentToast(this.translate.instant('PAN_CARD_PENDING'));
        return;
      }
    }
    this.addressproof=true;


  }
  close_proof()
  {
    this.addressproof=false;
    this.proof_front = { filename:'',base64:null};
    this.proof_back = { filename:'',base64:null};
    this.pan_card = { filename:'pan_card',base64:null};
    this.selected_proof_type='';
    this.proof_number='';
    this.proof_expiry_date='';
    this.upload_Form_touched=false;
    
  }



  // 
  async presentActionSheet(side) {
    this.selected_side = side;
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


  async getPicture(sourceType) 
  {
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
        this.base64.encodeFile(imageData)
         .then((base64File: string) => {
           console.log(base64File);
                var trim_data=base64File.split(',')
                console.log(trim_data[1])
                
             this.file.resolveLocalFilesystemUrl(imageData)
                 .then(fileEntry => { 
                   fileEntry.getMetadata((metadata) => { 
                     //metadata.size is the size in bytes
                     if((metadata.size) > 2000000){
                       loading.dismiss();
                       this.toaster.warning_presentToast(this.translate.instant('SELECT_DOC_LESS_THAN_2MB'))
                       return false;
                     }
                     else{
                          if(this.selected_doc_type == 'pan_card'){
                            this.pan_card.base64='data:image/jpg;base64,'+trim_data[1];
                            this.pan_card.filename=imageData.substr(imageData.lastIndexOf('/') + 1);
                          }else if(this.selected_side == 'proof_front'){
                            this.proof_front.base64='data:image/jpg;base64,'+trim_data[1];
                            this.proof_front.filename=imageData.substr(imageData.lastIndexOf('/') + 1);
                          }else if(this.selected_side == 'proof_back'){
                            this.proof_back.base64='data:image/jpg;base64,'+trim_data[1];
                            this.proof_back.filename=imageData.substr(imageData.lastIndexOf('/') + 1);
                          }else if(this.selected_side == 'back_account'){
                            this.proof.base64='data:image/jpg;base64,'+trim_data[1];
                            this.proof.filename=imageData.substr(imageData.lastIndexOf('/') + 1);
                          }

                          loading.dismiss();
                         }
                         } )
                       })
            }, (err) => {
              loading.dismiss();
                this.toaster.warning_presentToast(this.translate.instant('SELECT_IMAGE_TYPE'))
              });

        
      
      }, (err) => {
        
         if(err == 'No Image Selected')
          {
            this.toaster.warning_presentToast(this.translate.instant('SELECT_IMAGE_TYPE'))
          }
         
      })

    }
    else
    {
      this.toaster.warning_presentToast(this.translate.instant('CORDOVA_UNAVAILABLE'));
    }
  }

  async upload_docs(){

    this.upload_Form_touched = true;
    if(this.valid_fun('selected_proof_type')!=''){
      return;
    }else if(this.valid_fun('proof_number')!=''){
      return;
    }else if(this.valid_fun('expiry_date')!='' && this.expiry_dates[this.selected_proof_type]){
      return;
    }else if(this.valid_fun('proof_front')!=''){
      return;
    }else if(this.valid_fun('proof_back')!='' && this.allowed_sides[this.selected_proof_type]){
      return;
    }
    const loading = await this.loadingCtrl.create({
      spinner:null,
      message:'',
    });
    loading.present();
    console.log("valid_fun");
    var postData;
    if(this.selected_doc_type == 'address_proof'){
      postData = {
        address_proof_type:this.selected_proof_type,
        address_proof_number:this.proof_number,
        address_proof_expiry_date:this.proof_expiry_date,
        address_proof_front:this.proof_front,
        address_proof_back:this.proof_back
      }
      this.user.upload_address_proof(postData).subscribe((resp:any)=>{
        loading.dismiss();
        if(resp.code == 0){
          this.get_Status();
          this.user.presentsuccessAlert(this.translate.instant(resp.message));  
        }else{
          this.user.presentfailAlert(this.translate.instant(resp.message),'<ion-img src="assets/imgs/warning.png">');
        }
        
      },err=>{
        loading.dismiss();
        this.errorService.errorsMethod(err);
      })

    }else if(this.selected_doc_type == 'id_proof'){
      postData = {
        id_proof_type:this.selected_proof_type,
        id_proof_number:this.proof_number,
        id_proof_expiry_date:this.proof_expiry_date,
        id_proof_front:this.proof_front,
        id_proof_back:this.proof_back
      }
      this.user.upload_id_proof(postData).subscribe((resp:any)=>{
        loading.dismiss();
        if(resp.code == 0){
          this.get_Status();
          this.user.presentsuccessAlert(this.translate.instant(resp.message));  
        }else{
          this.user.presentfailAlert(this.translate.instant(resp.message),'<ion-img src="assets/imgs/warning.png">');
        }
        
      },err=>{
        loading.dismiss();
        this.errorService.errorsMethod(err);
      })
      
    }else if(this.selected_doc_type == 'pan_card'){
       postData = {
         pan_card_number:this.proof_number,
         pan_card:this.pan_card
       }
      this.user.upload_pan_card(postData).subscribe((resp:any)=>{
        loading.dismiss();
        if(resp.code == 0){
          this.get_Status();
          this.user.presentsuccessAlert(this.translate.instant(resp.message));  
        }else{
          this.user.presentfailAlert(this.translate.instant(resp.message),'<ion-img src="assets/imgs/warning.png">');
        }
        
      },err=>{
        loading.dismiss();
        this.errorService.errorsMethod(err);
      })
    }
    
    this.close_proof();
    

  }
  proof_front_btn(){
    return this.proof_front.base64 == null && this.pan_card.base64 == null;
}
proof_back_btn(){
    return this.proof_back.base64 == null;
}

  valid_fun(filed){
    if(!this.upload_Form_touched){
      return '';
    }
    if(filed == 'selected_proof_type'){
      if(this.selected_proof_type == '' || this.selected_proof_type == undefined){
        if(this.selected_doc_type == 'address_proof'){
          return this.translate.instant('ADDRESS_PROOF_TYPE_REQUIRED');
        }else if(this.selected_doc_type == 'id_proof'){
          return this.translate.instant('ID_PROOF_TYPE_REQUIRED');
        }        
      }
    }else if(filed == 'proof_number'){
      if(this.proof_number == '' || this.proof_number == undefined){
        if(this.selected_doc_type == 'address_proof'){
          return this.translate.instant('ADDRESS_PROOF_NUMBER_REQUIRED');
        }else if(this.selected_doc_type == 'id_proof'){
          return this.translate.instant('ID_PROOF_NUMBER_REQUIRED');
        }else if(this.selected_doc_type == 'pan_card' || this.selected_proof_type == 'pan_card'){
          return this.translate.instant('PAN_NUM_REQ');
        }        
      }else if(this.selected_doc_type == 'pan_card' || this.selected_proof_type == 'pan_card'){
        var regpan = /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/;
        if(!regpan.test(this.proof_number)){
          return this.translate.instant('PAN_PATTERN');
        }

      }else if(this.selected_doc_type == 'address_proof' || this.selected_doc_type == 'id_proof'){
        var check_num = /^[\w\s_-]*$/;
        if(!check_num.test(this.proof_number)){
          return this.translate.instant('INVALID')+' '+this.proofs_list[this.selected_proof_type]+' '+this.translate.instant('NUMBER');
        }

      }

    }else if(filed == 'expiry_date'){
      if(this.proof_expiry_date == '' || this.proof_expiry_date == undefined){
        if(this.selected_doc_type == 'address_proof'){
          return this.translate.instant('ADDRESS_PROOF')+' '+this.translate.instant('EXPIRY_DATE_REQUIRED');
        }else if(this.selected_doc_type == 'id_proof'){
          return this.translate.instant('ID_PROOF')+' '+this.translate.instant('EXPIRY_DATE_REQUIRED');
        }        
      }
    }
    else if(filed == 'proof_front'){
      if((this.proof_front.base64 == '' || this.proof_front.base64 == null) && (this.pan_card.base64 == null || this.pan_card.base64 == '')){
        if(this.selected_doc_type == 'address_proof'){
          return this.translate.instant('ADDRESS_PROOF_FRONT_REQUIRED');
        }else if(this.selected_doc_type == 'id_proof'){
          return this.translate.instant('ID_PROOF_FRONT_REQUIRED');
        }else if(this.selected_doc_type == 'pan_card'){
          return this.translate.instant('PAN_REQUIRED');
        }         
      }
    }
    else if(filed == 'proof_back'){
      if(this.proof_back.base64 == '' || this.proof_back.base64 == null){
        if(this.selected_doc_type == 'address_proof'){
          return this.translate.instant('ADDRESS_PROOF_BACK_REQUIRED');
        }else if(this.selected_doc_type == 'id_proof'){
          return this.translate.instant('ID_PROOF_BACK_REQUIRED');
        }        
      }
    }
    return '';
  }


  doRefresh(event) {
       this.get_Status();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }


    bankSubmit(){
      this.submitted = true;
      var msg;

       this.submitted = true;
      this.touched_bankForm = true;
      this.addressproof=true;
        if (this.bankForm.valid) {
          if(this.proof.base64==null || this.proof.base64==''){
            // msg = this.translate.instant('BANK_PASSBOOK');
            this.bank_passbook_err_msg = this.translate.instant('BANK_PASSBOOK');

            // this.user.presentToast(msg);
            return false;
          }
          this.bankconfirmation();
        }        
  }
   change_st($event){

     this.cities=this.all_cities[$event.detail.value];

   }
    // bank adding confirmation

    async bankconfirmation() {

      const loading = await this.loadingCtrl.create({
      message:'',
      spinner:null
    });
      
      // console.log('bankconfirmation')
    const alert = await this.alertController.create({
      header:this.translate.instant('CONFIRMATION'),
      message: this.translate.instant('BANK_ADD_ALERT'),
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
            loading.present();
          this.user.addBank(this.bankForm,this.proof).subscribe((resp:any) => {
           this.touched_bankForm = false;

          // code5: For checking whether user done his kyc or not 
            if(resp.code == 5)
                {
                  loading.dismiss();
                  this.bankUpload=false;
                  this.bankForm.reset();
                  this.toaster.warning_presentToast(this.translate.instant(resp.message));
                  this.navCtrl.navigateForward('/upload-docs');
                }
              // code4:For error messages and no data messages
              else if(resp.code == 4){
                loading.dismiss();
                this.bankUpload=false;
                this.addressproof=false;

                this.bankForm.reset();
               this.toaster.warning_presentToast(this.translate.instant(resp.message));
              }  
            else{
              // this.user.presentToast(this.toasters[28].title);
              this.user.presentsuccessAlert(this.translate.instant(resp.message))
              this.bankUpload=false;
              this.addressproof=false;

               this.get_Status();

            
               loading.dismiss();           
               // this.nobanks=false;
              // this.bankForm.reset();

            }
            loading.dismiss();
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

  bank_valid(filed)
  {
    // console.log(filed)
    
    if(filed == 'nick_name'){ 
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('nick_name').hasError('required')){
        return this.translate.instant('NICK_NAME_REQUIRED');
      }
      else if(this.bankForm.get('nick_name').hasError('minlength'))
      {
        return this.translate.instant('NICK_NAME_MINLENGTH');
      }
      else if(this.bankForm.get('nick_name').hasError('pattern'))
      {
        return this.translate.instant('BANK_NICK_NAME_PATTERN');
      }
        return '';
    }
    if(filed == 'holder_name'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('holder_name').hasError('required')){
        return this.translate.instant('HOLDER_NAME_REQUIRED');
      }
      else if(this.bankForm.get('holder_name').hasError('minlength'))
      {
        return this.translate.instant('ACCOUNT_NAME_MINLENGTH');
      }
      else if(this.bankForm.get('holder_name').hasError('pattern'))
      {
        return this.translate.instant('ACCOUNT_NAME_PATTERN');
      }    
        return '';
    }
    if(filed == 'branch_name'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('branch_name').hasError('required')){
        return this.translate.instant('BRANCH_NAME_REQUIRED');
      }
      else if(this.bankForm.get('branch_name').hasError('minlength'))
      {
        return this.translate.instant('BRANCH_NAME_MINLENGTH');
      }
      else if(this.bankForm.get('branch_name').hasError('pattern'))
      {
        return this.translate.instant('BRANCH_NAME_PATTERN');
      }     
        return '';
    }
    if(filed == 'account_number'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('account_number').hasError('required')){
        return this.translate.instant('ACCOUNT_NUMBER_REQUIRED');
      }
      else if(this.bankForm.get('account_number').hasError('min'))
      {
       return this.translate.instant('ACCOUNT_NUM_LENGTH');
      }
      else if(this.bankForm.get('account_number').hasError('pattern'))
      {
        return this.translate.instant('ACCOUNT_NUMBER');
      }     
        return '';
    }
    if(filed == 'bank_name'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('bank_name').hasError('required')){
        return this.translate.instant('BANK_NAME_REQUIRED');
      }
      
        return '';
    }
    if(filed == 'account_type'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('account_type').hasError('required')){
        return this.translate.instant('ACCOUNT_TYPE_REQUIRED');
      }
        return '';
    }
    if(filed == 'ifsc_code'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('ifsc_code').hasError('required')){
        return this.translate.instant('IFSC_REQUIRED');
      }
      else if(this.bankForm.get('ifsc_code').hasError('pattern'))
      {
        return this.translate.instant('IFSC_PATTERN');
      }
      
        return '';
    }
    if(filed == 'state_name'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('state_name').hasError('required')){
        return this.translate.instant('STATE_REQUIRED');
      }      
        return '';
    }
    if(filed == 'city_name'){  
      if(!this.bankForm.touched && !this.touched_bankForm){return '';}
      if(this.bankForm.get('city_name').hasError('required')){
        return this.translate.instant('CITY_REQUIRED');
      }
      
        return '';
    }
    return '';
  }


}
