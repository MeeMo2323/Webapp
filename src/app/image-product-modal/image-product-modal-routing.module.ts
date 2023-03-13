import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageProductModalPage } from './image-product-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ImageProductModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageProductModalPageRoutingModule {}
