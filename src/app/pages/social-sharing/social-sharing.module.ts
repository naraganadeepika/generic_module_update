import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SocialSharingPageRoutingModule } from './social-sharing-routing.module';

import { SocialSharingPage } from './social-sharing.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    SocialSharingPageRoutingModule
  ],
  declarations: [SocialSharingPage]
})
export class SocialSharingPageModule {}
