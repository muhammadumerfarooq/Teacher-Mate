import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NativePlayerPage } from './native-player';

@NgModule({
  declarations: [
    NativePlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(NativePlayerPage),
  ],
})
export class NativePlayerPageModule {}
