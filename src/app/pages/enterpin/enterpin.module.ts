import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnterpinPageRoutingModule } from './enterpin-routing.module';

import { EnterpinPage } from './enterpin.page';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    EnterpinPageRoutingModule
  ],
  declarations: [EnterpinPage]
})
export class EnterpinPageModule {}
