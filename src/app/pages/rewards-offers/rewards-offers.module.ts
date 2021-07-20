import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RewardsOffersPageRoutingModule } from './rewards-offers-routing.module';

import { RewardsOffersPage } from './rewards-offers.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RewardsOffersPageRoutingModule
  ],
  declarations: [RewardsOffersPage]
})
export class RewardsOffersPageModule {}
