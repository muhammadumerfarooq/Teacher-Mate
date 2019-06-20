import { NgModule } from '@angular/core';

import { ProgressBarComponent } from './progress-bar/progress-bar';
import { RelativeTimePipe } from '../pipes/relative-time/relative-time';

@NgModule({
  imports: [
  ],
  declarations: [
    ProgressBarComponent,
    RelativeTimePipe
  ],
  exports: [
    ProgressBarComponent,
    RelativeTimePipe
  ]
})

export class SharedModule { }