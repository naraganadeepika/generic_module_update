import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AffiliateAmountPage } from './affiliate-amount.page';

const routes: Routes = [
  {
    path: '',
    component: AffiliateAmountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AffiliateAmountPageRoutingModule {}
