import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { ResetpwdPageRoutingModule } from './resetpwd-routing.module';

import { ResetpwdPage } from './resetpwd.page';

import { HeadersharedModule } from '../../components/headershared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    ResetpwdPageRoutingModule,
    HeadersharedModule
  ],
  declarations: [ResetpwdPage]
})
export class ResetpwdPageModule {}
