import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RptReceiveFinesPageRoutingModule } from './rpt-receive-fines-routing.module';

import { RptReceiveFinesPage } from './rpt-receive-fines.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RptReceiveFinesPageRoutingModule
  ],
  declarations: [RptReceiveFinesPage]
})
export class RptReceiveFinesPageModule {}
