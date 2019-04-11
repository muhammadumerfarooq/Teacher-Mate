import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TakeQuizPage } from './take-quiz';

@NgModule({
  declarations: [
    TakeQuizPage,
  ],
  imports: [
    IonicPageModule.forChild(TakeQuizPage),
  ],
})
export class TakeQuizPageModule {}
