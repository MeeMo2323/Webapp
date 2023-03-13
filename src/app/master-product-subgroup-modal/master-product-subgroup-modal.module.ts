import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterProductSubgroupModalPageRoutingModule } from './master-product-subgroup-modal-routing.module';

import { MasterProductSubgroupModalPage } from './master-product-subgroup-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterProductSubgroupModalPageRoutingModule
  ],
  declarations: [MasterProductSubgroupModalPage]
})
export class MasterProductSubgroupModalPageModule {}
