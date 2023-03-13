import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterProductModalPage } from './master-product-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MasterProductModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterProductModalPageRoutingModule {}
