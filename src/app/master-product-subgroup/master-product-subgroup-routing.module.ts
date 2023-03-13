import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterProductSubgroupPage } from './master-product-subgroup.page';

const routes: Routes = [
  {
    path: '',
    component: MasterProductSubgroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterProductSubgroupPageRoutingModule {}
