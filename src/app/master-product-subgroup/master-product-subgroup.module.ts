import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterProductSubgroupPageRoutingModule } from './master-product-subgroup-routing.module';

import { MasterProductSubgroupPage } from './master-product-subgroup.page';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterProductSubgroupPageRoutingModule,
    NgxDatatableModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [MasterProductSubgroupPage]
})
export class MasterProductSubgroupPageModule {}
