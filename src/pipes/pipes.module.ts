import { NgModule } from '@angular/core';
import { RelativeTimePipe } from './relative-time/relative-time';
import { SearchPostPipe } from './search-post/search-post';
@NgModule({
	declarations: [RelativeTimePipe, SearchPostPipe],
	imports: [],
	exports: [RelativeTimePipe, SearchPostPipe]
})
export class PipesModule {}
