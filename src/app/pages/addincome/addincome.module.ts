import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddincomePageRoutingModule } from './addincome-routing.module';

import { AddincomePage } from './addincome.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddincomePageRoutingModule
  ],
  declarations: [AddincomePage]
})
export class AddincomePageModule {}
