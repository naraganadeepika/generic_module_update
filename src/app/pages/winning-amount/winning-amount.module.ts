import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WinningAmountPageRoutingModule } from './winning-amount-routing.module';

import { WinningAmountPage } from './winning-amount.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    WinningAmountPageRoutingModule
  ],
  declarations: [WinningAmountPage]
})
export class WinningAmountPageModule {}
