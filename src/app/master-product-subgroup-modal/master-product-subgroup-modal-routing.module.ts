import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterProductSubgroupModalPage } from './master-product-subgroup-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MasterProductSubgroupModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterProductSubgroupModalPageRoutingModule {}
