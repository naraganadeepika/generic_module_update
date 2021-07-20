import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankaccountsPageRoutingModule } from './bankaccounts-routing.module';

import { BankaccountsPage } from './bankaccounts.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    BankaccountsPageRoutingModule
  ],
  declarations: [BankaccountsPage]
})
export class BankaccountsPageModule {}
