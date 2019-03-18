import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BroadcastsListPage } from './broadcasts-list';

@NgModule({
  declarations: [
    BroadcastsListPage,
  ],
  imports: [
    IonicPageModule.forChild(BroadcastsListPage),
  ],
})
export class BroadcastsListPageModule {}
