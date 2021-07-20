import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadStatementPage } from './download-statement.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadStatementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadStatementPageRoutingModule {}
