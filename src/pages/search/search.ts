import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  searchText:string = '';
  constructor(private viewCtrl:ViewController,public navCtrl: NavController, public navParams: NavParams, private searchservice:SearchProvider) {
    this.searchservice.getfeedstitles();
  }

  ionViewDidLoad() {
   // console.log('ionViewDidLoad SearchPage');
  }
  chooseItem(Item:any){

  }
  dismiss() {
    this.viewCtrl.dismiss();
}

}
