import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsDetailPage } from './notifications-detail';

@NgModule({
  declarations: [
    NotificationsDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationsDetailPage),
  ],
})
export class NotificationsDetailPageModule {}
