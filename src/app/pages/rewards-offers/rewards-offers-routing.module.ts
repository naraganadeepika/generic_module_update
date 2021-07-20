import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RewardsOffersPage } from './rewards-offers.page';

const routes: Routes = [
  {
    path: '',
    component: RewardsOffersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RewardsOffersPageRoutingModule {}
