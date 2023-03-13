import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BorrowListPage } from './borrow-list.page';

const routes: Routes = [
  {
    path: '',
    component: BorrowListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BorrowListPageRoutingModule {}
