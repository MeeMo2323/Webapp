import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiveProductCreateModalPage } from './receive-product-create-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ReceiveProductCreateModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiveProductCreateModalPageRoutingModule {}
