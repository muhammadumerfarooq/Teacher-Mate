import { NgModule } from '@angular/core';

import { ProgressBarComponent } from './progress-bar/progress-bar';
import { RelativeTimePipe } from '../pipes/relative-time/relative-time';
import { SearchPostPipe } from '../pipes/search-post/search-post';

@NgModule({
  imports: [
  ],
  declarations: [
    ProgressBarComponent,
    RelativeTimePipe,
    SearchPostPipe
  ],
  exports: [
    ProgressBarComponent,
    RelativeTimePipe,
    SearchPostPipe
  ]
})

export class SharedModule { }