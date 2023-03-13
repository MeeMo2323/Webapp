import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RptStockRemainPageRoutingModule } from './rpt-stock-remain-routing.module';

import { RptStockRemainPage } from './rpt-stock-remain.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RptStockRemainPageRoutingModule
  ],
  declarations: [RptStockRemainPage]
})
export class RptStockRemainPageModule {}
