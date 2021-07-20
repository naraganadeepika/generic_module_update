import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiningPageRoutingModule } from './mining-routing.module';

import { MiningPage } from './mining.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiningPageRoutingModule
  ],
  declarations: [MiningPage]
})
export class MiningPageModule {}
