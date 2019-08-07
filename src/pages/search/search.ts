import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { PostProvider, Myfeed } from '../../providers/post/post';

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
  constructor(private modalctrl: ModalController,private post:PostProvider,private viewCtrl:ViewController,public navCtrl: NavController, public navParams: NavParams, private searchservice:SearchProvider) {
    this.searchservice.getfeedstitles();
  }

  ionViewDidLoad() {
   // console.log('ionViewDidLoad SearchPage');
  }
  chooseItem(Item:any){
    
    let feed: Myfeed = new Myfeed();

    this.post.Feeds.forEach(res=>{
      if (res.title == Item){
        feed =  res as Myfeed;
      }
    });

    var modalPage = this.modalctrl.create('PostDetailPage', { Myfeed: feed });
    modalPage.onDidDismiss(data => {
      if (data == true) {
        // this.presentAlert('Success', ' post created');
      } else if (data == false) {
        //  this.presentAlert('Error', ' post not created');
      } else if (data == 'back') {

      }
    });
    modalPage.present();


  }
  dismiss() {
    this.viewCtrl.dismiss();
}

}
