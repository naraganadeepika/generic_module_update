import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuspendAccountPageRoutingModule } from './suspend-account-routing.module';

import { SuspendAccountPage } from './suspend-account.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SuspendAccountPageRoutingModule
  ],
  declarations: [SuspendAccountPage]
})
export class SuspendAccountPageModule {}
