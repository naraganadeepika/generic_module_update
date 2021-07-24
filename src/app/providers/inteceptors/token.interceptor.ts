import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  Router
} from '@angular/router';

import { ToastController,ModalController } from '@ionic/angular';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
token:any;
element:any;

  constructor(private router: Router,
    public toastController: ToastController,public modalCtrl:ModalController) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

 
 this.token = JSON.parse(localStorage.getItem('token'));

    // console.log(token);

    if (this.token) {
      request = request.clone({
        setHeaders: {
          'Authorization': this.token
        }
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
       
        if (error.status === 401) {
          if (error.error.success === false) {
            this.presentToast('Login failed');
          } else {
            //navigate to submit pin after dismissing modal if it is open
             this.element =  this.modalCtrl.getTop();
            if(this.element.__zone_symbol__value != undefined)
            {
              this.modalCtrl.dismiss();
              this.router.navigate(['submitpin']);
            }
            else
            {
              this.router.navigate(['submitpin']);
            }
          }
        } 
        else if(error.error === "Your session was expired" || error.error ==='You are blocked, Please try to contact our costumer care'){
            this.presentToast(error.error);
            this.router.navigate(['submitpin']);
            const email=localStorage.getItem('email');
            var lang=localStorage.getItem('LANG');
            if(lang == null)
            {
              lang='english';
            }
            localStorage.clear();
            localStorage.setItem('tutorialComplete', JSON.stringify(true));
            localStorage.setItem('LANG', lang);
            localStorage.setItem('email', email);
        }
        
       
       return throwError(error);
      }));
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      cssClass:'warning_toaster_alert',
      buttons: ['X']
    });
    toast.present();
  }
}
