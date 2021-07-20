import { Injectable } from '@angular/core';
import { AlertsService } from '../alerts/alerts.service';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(public alert_:AlertsService, public translate: TranslateService) { }

  errorsMethod(err)
  {
    var alert_Data = {header:'',img:'',message:''}
    alert_Data.header = '';
      if(err.status == 500){
        
        alert_Data.img ='internal';
        alert_Data.message=this.translate.instant(err.error.error);
      }
      else if(err.status==0)
      {
        alert_Data.img ='server_not_found';
      alert_Data.message='server not found';
       
      }
      else if(err.status==422 || err.error=="USER_BLOCKED" || err.error=="EMAIL_CONFIRMED")
      {
        alert_Data.img ='warning';
      alert_Data.message=this.translate.instant(err.error);
      
        
      }
      else if(err.status==401)
      {
        return;
      }
      else if(err.error=="USER_NOTFOUND" || err.error=='USER_NOT_EXIST'){
        alert_Data.img ='user_not_found';
      alert_Data.message=this.translate.instant(err.error);
       
      }
     else if(err.error=="INVALID_USER"){
       alert_Data.img ='warning';
      alert_Data.message=this.translate.instant(err.error);
      }

     else if(err.error=="EMAIL_NOTFOUND")
      {
        alert_Data.img ='error';
      alert_Data.message=this.translate.instant(err.error);
      }
    
     else if(err.error.nick_name)
     {
       alert_Data.img ='warning';
      alert_Data.message=this.translate.instant(err.error.nick_name[0]);

     }
     else if(err.error.account_number)
      {
        alert_Data.img ='error';
      alert_Data.message=this.translate.instant(err.error.account_number[0]);

      }
      else{
        alert_Data.img ='warning';
      alert_Data.message=this.translate.instant(err.error);
      }
      console.log(alert_Data);
      this.alert_.presentAlert(alert_Data);  
  }
}