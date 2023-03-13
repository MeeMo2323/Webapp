import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterProductGroupModalPageRoutingModule } from './master-product-group-modal-routing.module';

import { MasterProductGroupModalPage } from './master-product-group-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterProductGroupModalPageRoutingModule
  ],
  declarations: [MasterProductGroupModalPage]
})
export class MasterProductGroupModalPageModule {}
