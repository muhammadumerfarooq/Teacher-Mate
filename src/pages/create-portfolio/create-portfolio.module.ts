import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePortfolioPage } from './create-portfolio';
import { RespectBarComponent } from '../respect-bar/respect-bar';

import { ProgressBarComponent } from '../progress-bar/progress-bar';

@NgModule({
  declarations: [
    CreatePortfolioPage,
    RespectBarComponent,
    ProgressBarComponent
  ],
  imports: [
    IonicPageModule.forChild(CreatePortfolioPage),
  ],
})
export class CreatePortfolioPageModule {}
