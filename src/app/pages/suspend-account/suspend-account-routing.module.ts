import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuspendAccountPage } from './suspend-account.page';

const routes: Routes = [
  {
    path: '',
    component: SuspendAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuspendAccountPageRoutingModule {}
