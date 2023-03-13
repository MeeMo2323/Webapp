import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiveProductAttachmentPageRoutingModule } from './receive-product-attachment-routing.module';

import { ReceiveProductAttachmentPage } from './receive-product-attachment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiveProductAttachmentPageRoutingModule
  ],
  declarations: [ReceiveProductAttachmentPage]
})
export class ReceiveProductAttachmentPageModule {}
