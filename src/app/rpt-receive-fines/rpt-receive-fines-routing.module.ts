import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RptReceiveFinesPage } from './rpt-receive-fines.page';

const routes: Routes = [
  {
    path: '',
    component: RptReceiveFinesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RptReceiveFinesPageRoutingModule {}
