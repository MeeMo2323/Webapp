import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterCustomerPage } from './master-customer.page';

const routes: Routes = [
  {
    path: '',
    component: MasterCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterCustomerPageRoutingModule {}
