import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestmoneyPageRoutingModule } from './requestmoney-routing.module';

import { RequestmoneyPage } from './requestmoney.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestmoneyPageRoutingModule
  ],
  declarations: [RequestmoneyPage]
})
export class RequestmoneyPageModule {}
