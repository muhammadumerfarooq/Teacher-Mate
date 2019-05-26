import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PortfolioHistoryPage } from './portfolio-history';

@NgModule({
  declarations: [
    PortfolioHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(PortfolioHistoryPage),
  ],
})
export class PortfolioHistoryPageModule {}
