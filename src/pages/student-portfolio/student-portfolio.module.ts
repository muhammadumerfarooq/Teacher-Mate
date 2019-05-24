import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentPortfolioPage } from './student-portfolio';
// import { ProgressBarComponentModule } from '../progress-bar/progress-bar.module';
import { SharedModule } from '../shared-modules';
@NgModule({
  declarations: [
    StudentPortfolioPage,
    
  ],
  imports: [
    IonicPageModule.forChild(StudentPortfolioPage),
    SharedModule
   // ProgressBarComponentModule
  ],
})
export class StudentPortfolioPageModule {}
