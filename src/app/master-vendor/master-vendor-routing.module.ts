import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterVendorPage } from './master-vendor.page';

const routes: Routes = [
  {
    path: '',
    component: MasterVendorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterVendorPageRoutingModule {}
