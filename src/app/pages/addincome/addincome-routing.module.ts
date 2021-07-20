import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddincomePage } from './addincome.page';

const routes: Routes = [
  {
    path: '',
    component: AddincomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddincomePageRoutingModule {}
