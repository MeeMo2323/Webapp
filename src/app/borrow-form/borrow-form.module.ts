import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BorrowFormPageRoutingModule } from './borrow-form-routing.module';

import { BorrowFormPage } from './borrow-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BorrowFormPageRoutingModule
  ],
  declarations: [BorrowFormPage]
})
export class BorrowFormPageModule {}
