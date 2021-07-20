import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WinningAmountPage } from './winning-amount.page';

const routes: Routes = [
  {
    path: '',
    component: WinningAmountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WinningAmountPageRoutingModule {}
