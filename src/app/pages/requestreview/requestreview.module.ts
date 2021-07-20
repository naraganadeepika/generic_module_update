import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestreviewPageRoutingModule } from './requestreview-routing.module';

import { RequestreviewPage } from './requestreview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestreviewPageRoutingModule
  ],
  declarations: [RequestreviewPage]
})
export class RequestreviewPageModule {}
