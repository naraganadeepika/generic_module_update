import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmitpinPage } from './submitpin.page';

const routes: Routes = [
  {
    path: '',
    component: SubmitpinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmitpinPageRoutingModule {}
