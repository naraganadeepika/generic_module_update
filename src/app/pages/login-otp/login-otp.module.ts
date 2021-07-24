import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginOtpPageRoutingModule } from './login-otp-routing.module';

import { LoginOtpPage } from './login-otp.page';
import { TranslateModule } from '@ngx-translate/core';
import { HeadersharedModule } from '../../components/headershared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginOtpPageRoutingModule,
     TranslateModule,
     ReactiveFormsModule,
     HeadersharedModule
  ],
  declarations: [LoginOtpPage]
})
export class LoginOtpPageModule {}
