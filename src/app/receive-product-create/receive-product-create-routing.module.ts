import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiveProductCreatePage } from './receive-product-create.page';

const routes: Routes = [
  {
    path: '',
    component: ReceiveProductCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiveProductCreatePageRoutingModule {}
