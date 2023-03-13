import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterVendorPageRoutingModule } from './master-vendor-routing.module';

import { MasterVendorPage } from './master-vendor.page';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterVendorPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [MasterVendorPage]
})
export class MasterVendorPageModule {}
