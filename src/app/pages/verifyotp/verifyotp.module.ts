import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';


import { IonicModule } from '@ionic/angular';

import { VerifyotpPageRoutingModule } from './verifyotp-routing.module';

import { VerifyotpPage } from './verifyotp.page';

import { HeadersharedModule } from '../../components/headershared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    VerifyotpPageRoutingModule,
    HeadersharedModule
  ],
  declarations: [VerifyotpPage]
})
export class VerifyotpPageModule {}
