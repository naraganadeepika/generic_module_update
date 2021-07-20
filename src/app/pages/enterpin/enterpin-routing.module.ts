import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnterpinPage } from './enterpin.page';

const routes: Routes = [
  {
    path: '',
    component: EnterpinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterpinPageRoutingModule {}
