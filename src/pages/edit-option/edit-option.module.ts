import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditOptionPage } from './edit-option';

@NgModule({
  declarations: [
    EditOptionPage,
  ],
  imports: [
    IonicPageModule.forChild(EditOptionPage),
  ],
})
export class EditOptionPageModule {}
