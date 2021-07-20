import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UerInfoPage } from './uer-info.page';

const routes: Routes = [
  {
    path: '',
    component: UerInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UerInfoPageRoutingModule {}
