import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterProductGroupModalPage } from './master-product-group-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MasterProductGroupModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterProductGroupModalPageRoutingModule {}
