import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryDetailPage } from './history-detail';
import { SharedModule } from '../shared-modules';

@NgModule({
  declarations: [
    HistoryDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryDetailPage),
    SharedModule
  ],
})
export class HistoryDetailPageModule {}
