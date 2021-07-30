import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaqsPageRoutingModule } from './faqs-routing.module';

import { FaqsPage } from './faqs.page';
import { HeadersharedModule } from '../../components/headershared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqsPageRoutingModule,
    HeadersharedModule,
     TranslateModule.forChild(),
  ],
  declarations: [FaqsPage]
})
export class FaqsPageModule {}
