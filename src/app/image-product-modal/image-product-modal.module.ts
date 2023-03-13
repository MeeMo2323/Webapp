import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageProductModalPageRoutingModule } from './image-product-modal-routing.module';

import { ImageProductModalPage } from './image-product-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageProductModalPageRoutingModule
  ],
  declarations: [ImageProductModalPage]
})
export class ImageProductModalPageModule {}
