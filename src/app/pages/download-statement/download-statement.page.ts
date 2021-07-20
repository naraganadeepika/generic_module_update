import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl,Validators,FormGroup } from '@angular/forms';
import { NavController, AlertController,MenuController, LoadingController } from '@ionic/angular';
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
  selector: 'app-download-statement',
  templateUrl: './download-statement.page.html',
  styleUrls: ['./download-statement.page.scss'],
})
export class DownloadStatementPage implements OnInit {
  time_period_value:any;
    range_div:boolean=false;
      public download_Form:FormGroup;
      touched_download_Form:boolean=false;
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
    private alertCtrl:AlertController,
    private loadingCtrl:LoadingController
    ) { }


  ngOnInit() 
  {

     this.download_Form = this.formBuilder.group({
        time: new FormControl('', Validators.compose([Validators.required])),
        start_date: new FormControl(''),
        end_date: new FormControl(''),
       });
  }
  customActionSheetOptions: any = {
    header: this.translate.instant('SELECT_TIME_PERIOD')
  };

  time_period(ev)
  {

    if(ev.detail.value == 'custom_date')
    {
      this.download_Form.get('start_date').setValidators([Validators.required]);
      this.download_Form.get('end_date').setValidators([Validators.required]);
        this.range_div=true;

    }
    else
    {
      this.download_Form.get('start_date').clearValidators();
      this.download_Form.get('end_date').clearValidators();
        this.download_Form.get('start_date').updateValueAndValidity();
        this.download_Form.get('end_date').updateValueAndValidity();
      this.range_div=false;
    }
    console.log(this.download_Form.valid);
  }

  download(){
    var Data:any;
    this.touched_download_Form = true;
    if(this.download_Form.valid){
        this.touched_download_Form = false;
        Data = {statement_type:this.download_Form.get('time').value}
        if(this.range_div){
          Data = {statement_type:this.download_Form.get('time').value,start:this.download_Form.get('start_date').value,end:this.download_Form.get('end_date').value}
        }
        this.loading_.presentLoading();
        this.user.download_statements(Data).subscribe((resp:any)=>{
          this.loading_.dismissLoading();
          if(resp.code == 0){
            this.user.presentsuccessAlert(this.translate.instant(resp.message));

          }else{

            if(resp.code == 5)
                  {
                    // this.user.presentToast(this.translate.instant(resp.message));
                    this.alert_Data.header='';
                    this.alert_Data.img ='warning';
                    this.alert_Data.message=this.translate.instant(resp.message);
                    this.alert_.presentAlert(this.alert_Data);
                    this.navCtrl.navigateForward('/upload-docs');
                  }
                // code4:For error messages and no data messages
                else if(resp.code == 4){
                  this.alert_Data.header='';
                  this.alert_Data.img ='warning';
                  this.alert_Data.message=this.translate.instant(resp.message);
                  this.alert_.presentAlert(this.alert_Data);
                } 
                 else if(resp.code == 16)
                 {
                  // this.PAN_required = true;
                  this.alert_Data.header='';
                  this.alert_Data.img ='warning';
                  this.alert_Data.message=this.translate.instant(resp.message);
                  this.alert_.presentAlert(this.alert_Data);
                  this.navCtrl.navigateForward('/upload-docs');
                  // this.upload_PAN(resp);
                  return;
                 } 
                else if(resp.code == 17){
                  this.alert_Data.header='';
                  this.alert_Data.img ='pending';
                  this.alert_Data.message=this.translate.instant(resp.message);
                  this.alert_.presentAlert(this.alert_Data);
                  return;
                }

                  this.alert_Data.header='';
                  this.alert_Data.img ='warning';
                  this.alert_Data.message=this.translate.instant(resp.message);
                  this.alert_.presentAlert(this.alert_Data);
          }
        },err=>{
          this.loading_.dismissLoading();
          this.errorService.errorsMethod(err);
        })
    }
    

  }

  valid_fun(filed)
  {
    // console.log(filed)
    
    if(filed == 'time'){ 
      if(!this.download_Form.touched && !this.touched_download_Form){return '';}
      if(this.download_Form.get('time').hasError('required')){
        return this.translate.instant('TIME_PERIOD_REQUIRED');
      }
      return '';
    }
    else if(filed == 'start_date'){
        if(!this.download_Form.touched && !this.touched_download_Form){return '';}
        if(this.download_Form.get('start_date').hasError('required')){
          return this.translate.instant('START_DATE_REQ');
        }
        return '';
      }
    else if(filed == 'end_date'){
        if(!this.download_Form.touched && !this.touched_download_Form){return '';}
        if(this.download_Form.get('start_date').hasError('required')){
          return this.translate.instant('END_DATE_REQ');
        }
        return '';
      }
    
    }
    toggle()
    {
      this.navCtrl.navigateForward("notifications");
    }

}

