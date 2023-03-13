import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterVendorModalPage } from './master-vendor-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MasterVendorModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterVendorModalPageRoutingModule {}
