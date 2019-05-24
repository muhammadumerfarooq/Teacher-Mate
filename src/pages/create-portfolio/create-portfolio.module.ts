import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePortfolioPage } from './create-portfolio';
//import { RespectBarComponent } from '../respect-bar/respect-bar';
import { SharedModule } from '../shared-modules';
// import { ProgressBarComponentModule } from '../progress-bar/progress-bar.module';

@NgModule({
  declarations: [
    CreatePortfolioPage,
    //  RespectBarComponent,
    
  ],
  imports: [
    IonicPageModule.forChild(CreatePortfolioPage),
    SharedModule
  ],
})
export class CreatePortfolioPageModule { }
