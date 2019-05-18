import { Component,Input } from '@angular/core';

/**
 * Generated class for the RespectBarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'respect-bar',
  templateUrl: 'respect-bar.html'
})
export class RespectBarComponent {

  text: string;
  @Input('respect') progress;

  constructor() {
    console.log('Hello RespectBarComponent Component');
    this.text = 'Hello World';
  }

}
