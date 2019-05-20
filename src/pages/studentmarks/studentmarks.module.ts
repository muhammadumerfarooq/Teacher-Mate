import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentmarksPage } from './studentmarks';

@NgModule({
  declarations: [
    StudentmarksPage,
  ],
  imports: [
    IonicPageModule.forChild(StudentmarksPage),
  ],
})
export class StudentmarksPageModule {}
