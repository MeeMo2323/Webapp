import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RptBorrowPageRoutingModule } from './rpt-borrow-routing.module';

import { RptBorrowPage } from './rpt-borrow.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RptBorrowPageRoutingModule
  ],
  declarations: [RptBorrowPage]
})
export class RptBorrowPageModule {}
