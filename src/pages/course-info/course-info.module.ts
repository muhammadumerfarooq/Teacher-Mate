import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourseInfoPage } from './course-info';

@NgModule({
  declarations: [
    CourseInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(CourseInfoPage),
  ],
})
export class CourseInfoPageModule {}
