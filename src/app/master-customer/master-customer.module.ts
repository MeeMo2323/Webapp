import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterCustomerPageRoutingModule } from './master-customer-routing.module';

import { MasterCustomerPage } from './master-customer.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterCustomerPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [MasterCustomerPage]
})
export class MasterCustomerPageModule {}
