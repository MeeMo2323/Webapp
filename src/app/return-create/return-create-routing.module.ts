import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReturnCreatePage } from './return-create.page';

const routes: Routes = [
  {
    path: '',
    component: ReturnCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnCreatePageRoutingModule {}
