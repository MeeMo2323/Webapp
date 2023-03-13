import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BorrowCreateModalPage } from './borrow-create-modal.page';

const routes: Routes = [
  {
    path: '',
    component: BorrowCreateModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BorrowCreateModalPageRoutingModule {}
