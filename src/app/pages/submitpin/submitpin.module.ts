import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmitpinPageRoutingModule } from './submitpin-routing.module';

import { SubmitpinPage } from './submitpin.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SubmitpinPageRoutingModule
  ],
  declarations: [SubmitpinPage]
})
export class SubmitpinPageModule {}
