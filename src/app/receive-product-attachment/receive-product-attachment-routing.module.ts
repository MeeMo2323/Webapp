import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiveProductAttachmentPage } from './receive-product-attachment.page';

const routes: Routes = [
  {
    path: '',
    component: ReceiveProductAttachmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiveProductAttachmentPageRoutingModule {}
