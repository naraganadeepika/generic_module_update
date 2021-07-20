import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DepositHistoryPageRoutingModule } from './deposit-history-routing.module';

import { DepositHistoryPage } from './deposit-history.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    DepositHistoryPageRoutingModule
  ],
  declarations: [DepositHistoryPage]
})
export class DepositHistoryPageModule {}
