import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterCustomerModalPage } from './master-customer-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MasterCustomerModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterCustomerModalPageRoutingModule {}
