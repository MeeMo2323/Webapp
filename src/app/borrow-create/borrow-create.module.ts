import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BorrowCreatePageRoutingModule } from './borrow-create-routing.module';

import { BorrowCreatePage } from './borrow-create.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BorrowCreatePageRoutingModule,
    NgxDatatableModule,
    AngularMyDatePickerModule,
    
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [BorrowCreatePage]
})
export class BorrowCreatePageModule {}
