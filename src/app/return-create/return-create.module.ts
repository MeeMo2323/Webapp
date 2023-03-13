import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReturnCreatePageRoutingModule } from './return-create-routing.module';
import { ReturnCreatePage } from './return-create.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnCreatePageRoutingModule,
    NgxDatatableModule,
    AngularMyDatePickerModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ReturnCreatePage]
})
export class ReturnCreatePageModule {}
