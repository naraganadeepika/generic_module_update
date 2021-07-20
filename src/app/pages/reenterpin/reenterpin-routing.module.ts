import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReenterpinPage } from './reenterpin.page';

const routes: Routes = [
  {
    path: '',
    component: ReenterpinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReenterpinPageRoutingModule {}
