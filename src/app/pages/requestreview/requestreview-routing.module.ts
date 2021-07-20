import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestreviewPage } from './requestreview.page';

const routes: Routes = [
  {
    path: '',
    component: RequestreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestreviewPageRoutingModule {}
