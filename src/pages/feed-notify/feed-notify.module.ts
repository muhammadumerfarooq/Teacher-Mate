import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedNotifyPage } from './feed-notify';

@NgModule({
  declarations: [
    FeedNotifyPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedNotifyPage),
  ],
})
export class FeedNotifyPageModule {}
