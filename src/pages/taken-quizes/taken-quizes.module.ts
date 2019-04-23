import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TakenQuizesPage } from './taken-quizes';

@NgModule({
  declarations: [
    TakenQuizesPage,
  ],
  imports: [
    IonicPageModule.forChild(TakenQuizesPage),
  ],
})
export class TakenQuizesPageModule {}
