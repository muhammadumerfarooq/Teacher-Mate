import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCoursesPage } from './add-courses';

@NgModule({
  declarations: [
    AddCoursesPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCoursesPage),
  ],
})
export class AddCoursesPageModule {}
