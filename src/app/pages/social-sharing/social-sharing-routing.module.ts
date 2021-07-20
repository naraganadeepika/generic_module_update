import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SocialSharingPage } from './social-sharing.page';

const routes: Routes = [
  {
    path: '',
    component: SocialSharingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialSharingPageRoutingModule {}
