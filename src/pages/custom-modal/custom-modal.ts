import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CustomModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@IonicPage()
@Component({
  selector: 'custom-modal',
  templateUrl:   'custom-modal.html'
})
export class CustomModalPage {
  images: Array<String> = new Array<String>();
  
  constructor(public viewCtrl: ViewController) {
    this.images.push('assets/img/trip/thumb/brown.jpg');
    this.images.push('assets/img/trip/thumb/brushes.jpg');
    this.images.push('assets/img/trip/thumb/deepteal.jpg');
    this.images.push('assets/img/trip/thumb/light.jpg');
    this.images.push('assets/img/trip/thumb/tree.jpg');
    this.images.push('assets/img/trip/thumb/ltblue.jpg');
    this.images.push('assets/img/trip/thumb/beakers.jpg');
console.log(this.images);
  }

  public dismiss(img: string) {
      this.viewCtrl.dismiss(img);
  }
}