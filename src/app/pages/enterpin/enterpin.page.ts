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
  selector: 'app-enterpin',
  templateUrl: './enterpin.page.html',
  styleUrls: ['./enterpin.page.scss'],
})
export class EnterpinPage implements OnInit {

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

  public connectedCspList:Array<string> = new Array(); 
res:any = '';
alert_Data = {header:'',img:'',message:''};
 //entered keys 
keyclick(ele){
if(this.connectedCspList.length < 6){
  this.connectedCspList.push(JSON.stringify(ele));
  if(this.connectedCspList.length == 6){this.enter();}  
} else {
}

}

//delete keys
backspace(){
if(this.connectedCspList.length > 0){
  this.connectedCspList.splice(-1);
}
}

//submit form

async enter(){
 
 if(this.connectedCspList.length == 6){
    for(var i = 0; i<this.connectedCspList.length; i++ ){
      this.res +=  this.connectedCspList[i];        
    }
    localStorage.setItem('pin', this.res);
      this.navCtrl.navigateRoot("reenterpin");
  } else {
      this.alert_Data.header='';
      this.alert_Data.img ='warning';
      this.alert_Data.message=this.translate.instant('PASSWORD_MINLENGTH');
      this.alert_.presentAlert(this.alert_Data);
this.res='';

  }

}

//side menu disable before login

ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }
  ngOnInit() {
  }

}
