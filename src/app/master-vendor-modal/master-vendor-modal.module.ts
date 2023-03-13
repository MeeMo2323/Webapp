import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterVendorModalPageRoutingModule } from './master-vendor-modal-routing.module';

import { MasterVendorModalPage } from './master-vendor-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterVendorModalPageRoutingModule
  ],
  declarations: [MasterVendorModalPage]
})
export class MasterVendorModalPageModule {}
