import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule,HttpRequest, HttpHeaders } from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators"; 

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { TokenInterceptor } from './providers/inteceptors/token.interceptor';
import { Network } from '@ionic-native/network/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';

import { File,IWriteOptions } from '@ionic-native/file/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';

import { AppVersion } from '@ionic-native/app-version/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
// import { PaymentModalPage } from './pages/payment-modal/payment-modal.page';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { Market } from '@ionic-native/market/ngx';
import { AuthGuardService} from './providers/auth-guard/auth-guard.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { SuccessmodalPageModule } from './pages/modals/successmodal/successmodal.module';
import { AddtransactionsPageModule } from './pages/modals/addtransactions/addtransactions.module';

export class TranslationService implements TranslateLoader {
    constructor(private http: HttpClient) { }
    
    getTranslation(): Observable<any> {

    return this.http.get(environment.path+'/get_language_files?keyterm='+localStorage.getItem('LANG'))
    .pipe(map((response: JSON) => {
    return response;
    }));
    
    }   
}
export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
  BrowserModule, 
  IonicModule.forRoot(),
  IonicStorageModule.forRoot(),
  HttpClientModule,
  FormsModule, ReactiveFormsModule,
  ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
  TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslationService,
        deps: [HttpClient]
      }
    }),
  JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:8100'],
        blacklistedRoutes: ['example.com/examplebadroute/']
      }
  }),
  AppRoutingModule,AddtransactionsPageModule,SuccessmodalPageModule],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Network,Camera,
    Base64,File,
    AppVersion,
    Contacts,
    OneSignal,
    LocalNotifications,
    SocialSharing,Crop,Market,Clipboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})


export class AppModule {}
