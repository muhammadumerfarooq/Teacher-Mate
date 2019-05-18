import { Component,Input } from '@angular/core';

/**
 * Generated class for the RespectBarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  text: string;
  @Input() props: { percent: number; message: string; };

  constructor() {
    console.log('Hello RespectBarComponent Component');
    this.text = 'Hello World';
  }

}
