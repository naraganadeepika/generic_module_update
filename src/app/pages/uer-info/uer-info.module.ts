import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UerInfoPageRoutingModule } from './uer-info-routing.module';

import { UerInfoPage } from './uer-info.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    UerInfoPageRoutingModule
  ],
  declarations: [UerInfoPage]
})
export class UerInfoPageModule {}
