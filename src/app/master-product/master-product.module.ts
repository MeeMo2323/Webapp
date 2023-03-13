import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterProductPageRoutingModule } from './master-product-routing.module';

import { MasterProductPage } from './master-product.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterProductPageRoutingModule,
    NgxDatatableModule 
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [MasterProductPage]
})
export class MasterProductPageModule {}
