import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { AffiliateAmountPageRoutingModule } from './affiliate-amount-routing.module';

import { AffiliateAmountPage } from './affiliate-amount.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    AffiliateAmountPageRoutingModule
  ],
  declarations: [AffiliateAmountPage]
})
export class AffiliateAmountPageModule {}
