import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterProductGroupPageRoutingModule } from './master-product-group-routing.module';

import { MasterProductGroupPage } from './master-product-group.page';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterProductGroupPageRoutingModule,
    NgxDatatableModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [MasterProductGroupPage]
})
export class MasterProductGroupPageModule {}
