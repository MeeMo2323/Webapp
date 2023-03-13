import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiveListPageRoutingModule } from './receive-list-routing.module';

import { ReceiveListPage } from './receive-list.page';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiveListPageRoutingModule,
    NgxDatatableModule,
    AngularMyDatePickerModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ReceiveListPage]
})
export class ReceiveListPageModule {}
