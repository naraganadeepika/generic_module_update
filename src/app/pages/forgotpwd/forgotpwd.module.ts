import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { ForgotpwdPageRoutingModule } from './forgotpwd-routing.module';

import { ForgotpwdPage } from './forgotpwd.page';
import { TranslateModule } from '@ngx-translate/core';
import { HeadersharedModule } from '../../components/headershared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    ForgotpwdPageRoutingModule,
    HeadersharedModule
  ],
  declarations: [ForgotpwdPage]
})
export class ForgotpwdPageModule {}
