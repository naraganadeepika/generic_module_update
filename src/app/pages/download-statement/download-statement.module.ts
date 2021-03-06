import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadStatementPageRoutingModule } from './download-statement-routing.module';

import { DownloadStatementPage } from './download-statement.page';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    DownloadStatementPageRoutingModule
  ],
  declarations: [DownloadStatementPage]
})
export class DownloadStatementPageModule {}
