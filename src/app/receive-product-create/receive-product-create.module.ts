import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReceiveProductCreatePageRoutingModule } from './receive-product-create-routing.module';
import { ReceiveProductCreatePage } from './receive-product-create.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiveProductCreatePageRoutingModule,
    NgxDatatableModule,
    AngularMyDatePickerModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ReceiveProductCreatePage]
})
export class ReceiveProductCreatePageModule {}
