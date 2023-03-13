import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RptStockRemainPage } from './rpt-stock-remain.page';

const routes: Routes = [
  {
    path: '',
    component: RptStockRemainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RptStockRemainPageRoutingModule {}
