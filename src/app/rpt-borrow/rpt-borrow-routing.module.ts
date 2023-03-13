import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RptBorrowPage } from './rpt-borrow.page';

const routes: Routes = [
  {
    path: '',
    component: RptBorrowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RptBorrowPageRoutingModule {}
