import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RptReceivePage } from './rpt-receive.page';

const routes: Routes = [
  {
    path: '',
    component: RptReceivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RptReceivePageRoutingModule {}
