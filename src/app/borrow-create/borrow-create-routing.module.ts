import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BorrowCreatePage } from './borrow-create.page';

const routes: Routes = [
  {
    path: '',
    component: BorrowCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BorrowCreatePageRoutingModule {}
