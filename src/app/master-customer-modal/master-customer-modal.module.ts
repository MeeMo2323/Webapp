import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterCustomerModalPageRoutingModule } from './master-customer-modal-routing.module';

import { MasterCustomerModalPage } from './master-customer-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterCustomerModalPageRoutingModule
  ],
  declarations: [MasterCustomerModalPage]
})
export class MasterCustomerModalPageModule {}
