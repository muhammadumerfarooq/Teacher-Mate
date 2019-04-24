import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizesResultsPage } from './quizes-results';

@NgModule({
  declarations: [
    QuizesResultsPage,
  ],
  imports: [
    IonicPageModule.forChild(QuizesResultsPage),
  ],
})
export class QuizesResultsPageModule {}
