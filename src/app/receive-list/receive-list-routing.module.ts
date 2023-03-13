import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiveListPage } from './receive-list.page';

const routes: Routes = [
  {
    path: '',
    component: ReceiveListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiveListPageRoutingModule {}
