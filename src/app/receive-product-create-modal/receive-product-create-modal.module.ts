import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiveProductCreateModalPageRoutingModule } from './receive-product-create-modal-routing.module';

import { ReceiveProductCreateModalPage } from './receive-product-create-modal.page';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiveProductCreateModalPageRoutingModule,
    NgxDatatableModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ReceiveProductCreateModalPage]
})
export class ReceiveProductCreateModalPageModule {}
