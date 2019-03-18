import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificatonsPage } from './notificatons';

@NgModule({
  declarations: [
    NotificatonsPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificatonsPage),
  ],
})
export class NotificatonsPageModule {}
