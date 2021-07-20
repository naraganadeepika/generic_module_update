import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddtransactionsPageRoutingModule } from './addtransactions-routing.module';

import { AddtransactionsPage } from './addtransactions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddtransactionsPageRoutingModule
  ],
  declarations: [AddtransactionsPage]
})
export class AddtransactionsPageModule {}
