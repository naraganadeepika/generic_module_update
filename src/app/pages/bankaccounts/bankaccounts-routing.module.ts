import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankaccountsPage } from './bankaccounts.page';

const routes: Routes = [
  {
    path: '',
    component: BankaccountsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankaccountsPageRoutingModule {}
