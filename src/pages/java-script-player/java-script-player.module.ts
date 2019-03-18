import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JavaScriptPlayerPage } from './java-script-player';

@NgModule({
  declarations: [
    JavaScriptPlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(JavaScriptPlayerPage),
  ],
})
export class JavaScriptPlayerPageModule {}
