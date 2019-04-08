import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisplayQuizPage } from './display-quiz';

@NgModule({
  declarations: [
    DisplayQuizPage,
  ],
  imports: [
    IonicPageModule.forChild(DisplayQuizPage),
  ],
})
export class DisplayQuizPageModule {}
