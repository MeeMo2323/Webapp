import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReturnCreateModalPageRoutingModule } from './return-create-modal-routing.module';

import { ReturnCreateModalPage } from './return-create-modal.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnCreateModalPageRoutingModule,
    NgxDatatableModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ReturnCreateModalPage]
})
export class ReturnCreateModalPageModule {}
