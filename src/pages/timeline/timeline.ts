import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, PopoverController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PostProvider, Myfeed } from '../../providers/post/post';
import { HomeServiceProvider } from '../../providers/home-service/home-service';
import { NativeAudio } from '@ionic-native/native-audio';
import { NotificationsServiceProvider } from '../../providers/notifications-service/notifications-service';
// import { ClassServiceProvider } from '../../providers/class-service/class-service';
// import { HomePage } from '../home/home';
/**
 * Generated class for the TimelinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})
export class TimelinePage {
  photos = [];

  constructor( private notifyservice:NotificationsServiceProvider,public popoverCtrl: PopoverController, private homeservice: HomeServiceProvider, private modalctrl: ModalController, private post: PostProvider, private camera: Camera, private alertctrl: AlertController, private cropservice: Crop, private imagepicker: ImagePicker, public navCtrl: NavController, public navParams: NavParams, public afauth: AngularFireAuth) {
    

    this.afauth.auth.onAuthStateChanged(user => {

      console.log(user);
      if (user == null) {

        // let page = this.navCtrl.getViews()
        //   .map(view => view).reverse()
        //   .find(view => view.id == 'HomePage');

  
   
     //   this.navCtrl.setRoot(HomePage);
     //   this.navCtrl.popToRoot();
      }
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TimelinePage');

  }
  chatpage() {


    var modalPage = this.modalctrl.create('ChatPage');
    modalPage.onDidDismiss(data => {
      if (data == true) {
        console.log(data + " parentsignup ")
        // this.viewCtrl.dismiss(true);
      }
    });
    modalPage.present();

  }

  openImagePicker() {
    let options = {
      maximumImagesCount: 5,
    }
    this.photos = new Array<string>();
    this.imagepicker.getPictures(options)
      .then((results) => {
        this.reduceImages(results).then(() => {
          console.log('all images cropped!!');
        });
      }, (err) => { console.log(err) });
  }
  
  reduceImages(selected_pictures: any): any {
    return selected_pictures.reduce((promise: any, item: any) => {
      return promise.then((result) => {
        return this.cropservice.crop(item, { quality: 100 })
          .then(cropped_image => this.photos.push(cropped_image));
      });
    }, Promise.resolve());
  }
  cropimage() {
    this.cropservice
      .crop(this.photos.pop(), { quality: 100 })
      .then((newImage) => {
        let base64Image = 'data:image/jpeg;base64,' + newImage;
        console.log(newImage)
        this.photos.push(base64Image);
      }).catch(error => {
        console.error("Error cropping image", error)
        this.presentAlert('error', error);
      })
  }

  presentAlert(alerttitle, alertsub) {
    let alert = this.alertctrl.create({
      title: alerttitle,
      subTitle: alertsub,
      buttons: ['OK']
    });
    alert.present();

  }
  goToDetail(feed: Myfeed) {


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

  presentNotifications(myEvent) {
    console.log(myEvent);
    let popover = this.popoverCtrl.create('NotificatonsPage');
    popover.present({
      ev: myEvent
    });
  }
  feedoption(feed: Myfeed, myEvent) {
    console.log();
    let popover = this.popoverCtrl.create('FeedNotifyPage', { feed: feed });
    console.log(myEvent)
    popover.present({ ev: myEvent });

  }
}
