import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentPortfolioPage } from './student-portfolio';

@NgModule({
  declarations: [
    StudentPortfolioPage,
  ],
  imports: [
    IonicPageModule.forChild(StudentPortfolioPage),
  ],
})
export class StudentPortfolioPageModule {}
