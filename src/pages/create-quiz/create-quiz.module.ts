import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateQuizPage } from './create-quiz';

@NgModule({
  declarations: [
    CreateQuizPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateQuizPage),
  ],
})
export class CreateQuizPageModule {}
