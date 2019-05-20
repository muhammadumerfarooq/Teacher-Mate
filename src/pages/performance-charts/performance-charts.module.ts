import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerformanceChartsPage } from './performance-charts';

@NgModule({
  declarations: [
    PerformanceChartsPage,
  ],
  imports: [
    IonicPageModule.forChild(PerformanceChartsPage),
  ],
})
export class PerformanceChartsPageModule {}
