import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatpublicPage } from './chatpublic';
import { SharedModule } from '../shared-modules';

@NgModule({
  declarations: [
    ChatpublicPage,

  ],
  imports: [
    IonicPageModule.forChild(ChatpublicPage),
    SharedModule
  ],
})
export class ChatpublicPageModule {}
