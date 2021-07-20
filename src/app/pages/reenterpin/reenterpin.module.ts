import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReenterpinPageRoutingModule } from './reenterpin-routing.module';

import { ReenterpinPage } from './reenterpin.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReenterpinPageRoutingModule
  ],
  declarations: [ReenterpinPage]
})
export class ReenterpinPageModule {}
