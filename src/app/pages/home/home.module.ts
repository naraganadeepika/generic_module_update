import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
// import { NgxGaugeModule } from 'ngx-gauge';
import { HomePage } from './home.page';

import { HeadersharedModule } from '../../components/headershared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    // NgxGaugeModule,
    HeadersharedModule,
    TranslateModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
