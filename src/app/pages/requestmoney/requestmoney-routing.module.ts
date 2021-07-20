import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestmoneyPage } from './requestmoney.page';

const routes: Routes = [
  {
    path: '',
    component: RequestmoneyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestmoneyPageRoutingModule {}
