import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizDetailPage } from './quiz-detail';

@NgModule({
  declarations: [
    QuizDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(QuizDetailPage),
  ],
})
export class QuizDetailPageModule {}
