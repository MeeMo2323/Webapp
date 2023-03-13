import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RptReceivePageRoutingModule } from './rpt-receive-routing.module';

import { RptReceivePage } from './rpt-receive.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RptReceivePageRoutingModule
  ],
  declarations: [RptReceivePage]
})
export class RptReceivePageModule {}
