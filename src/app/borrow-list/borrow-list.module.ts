import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BorrowListPageRoutingModule } from './borrow-list-routing.module';
import { BorrowListPage } from './borrow-list.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BorrowListPageRoutingModule,
    NgxDatatableModule,
    AngularMyDatePickerModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [BorrowListPage]
})
export class BorrowListPageModule {}
