import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterProductGroupPage } from './master-product-group.page';

const routes: Routes = [
  {
    path: '',
    component: MasterProductGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterProductGroupPageRoutingModule {}
