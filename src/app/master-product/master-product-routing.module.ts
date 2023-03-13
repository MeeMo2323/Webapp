import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterProductPage } from './master-product.page';

const routes: Routes = [
  {
    path: '',
    component: MasterProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterProductPageRoutingModule {}
