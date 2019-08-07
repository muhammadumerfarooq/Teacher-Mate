import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Myfeed, PostProvider } from '../../providers/post/post';
import { LoaderserviceProvider } from '../../providers/loaderservice/loaderservice';

/**
 * Generated class for the FeedNotifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed-notify',
  templateUrl: 'feed-notify.html',
})
export class FeedNotifyPage {

  feed: Myfeed = new Myfeed();
  constructor(private modalctrl:ModalController,private alertctrl:AlertController,private postservice:PostProvider,private loader:LoaderserviceProvider,public navCtrl: NavController, public navParams: NavParams) {
     this.feed = this.navParams.get('feed');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedNotifyPage');
  }
  editfeed(){
    //EditPostPage

    var modalPage = this.modalctrl.create('EditPostPage', { Myfeed: this.feed });
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

  deletefeed(){

    this.loader.loading = this.loader.loadingCtrl.create({

      content: `
    <div class="custom-spinner-container">
      <div class="custom-spinner-box"> loading... </div>
    </div>`,

    });
    setTimeout(() => {
      this.loader.loading.present().then(() => {
      this.postservice.deletepost(this.feed).then(res=>{
        if (res=='done'){
          this.loader.loading.dismiss();
          this.presentAlert('Post title '+this.feed.title,' deleted');
        }else if (res=='error'){
          this.loader.loading.dismiss();
          this.presentAlert('Error Post title '+this.feed.title,' not deleted');
        }
      }).catch(err=>{
        this.loader.loading.dismiss();
        this.presentAlert('Error Post title '+this.feed.title,' not deleted');

      });

    },500);

  

  });
}

presentAlert(alerttitle, alertsub) {
  let alert = this.alertctrl.create({
    title: alerttitle,
    subTitle: alertsub,
    buttons: ['OK']
  });
  alert.present();

}

}
